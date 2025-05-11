import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';
import jwt from 'jsonwebtoken';
import { userCollection } from '../db/models/user.js';
import { sessionCollection } from '../db/models/session.js';
import { sendEmail } from '../utils/sendEmail.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import {
  SMTP,
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constans/auth.js';
import { TEMPLATES_DIR } from '../constans/index.js';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = Date.now() + accessTokenLifeTime;
  const refreshTokenValidUntil = Date.now() + refreshTokenLifeTime;
  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const findSession = (query) => sessionCollection.findOne(query);

export const findUser = (query) => userCollection.findOne(query);

export const registerUser = async (payload) => {
  const user = await userCollection.findOne({ email: payload.email });
  // const user = await findUser({ email });
  if (user) {
    throw createHttpError(409, 'Email already in use');
  }
  const hashPassword = await bcrypt.hash(payload.password, 10);
  return await userCollection.create({
    ...payload,
    password: hashPassword,
  });
};

export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await findUser({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }
  if (!user.verify) {
    throw createHttpError(401, 'Email not verified');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password invalid');
  }
  await sessionCollection.findOneAndDelete({ userId: user._id });

  const session = createSession();
  return sessionCollection.create({
    userId: user._id,
    ...session,
  });
};

export const refreshUser = async ({ refreshToken, sessionId }) => {
  const session = await findSession({ refreshToken, _id: sessionId });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  if (session.refreshTokenValidUntil < Date.now()) {
    await sessionCollection.findOneAndDelete({ _id: session._id });
    throw createHttpError(401, 'Session token expired');
  }
  await sessionCollection.findOneAndDelete({ _id: session._id });
  const newSession = createSession();
  return sessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = (sessionId) =>
  sessionCollection.deleteOne({ _id: sessionId });

export const requestResetToken = async (email) => {
  const user = await userCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    console.log(error, 'Failed to send the email');
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (error) {
    if (error instanceof Error) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }
    throw error;
  }

  const user = await userCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await userCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
