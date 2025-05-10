import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'node:crypto';

import path from 'node:path';
import fs from 'node:fs/promises';
import Handlebars from 'handlebars';
import jwt from 'jsonwebtoken';
import { userCollection } from '../db/models/user.js';

import { sessionCollection } from '../db/models/session.js';
import { sendEmail } from '../utils/sendEmail.js';
import { getEnvVar } from '../utils/getEnvVar.js';

import { accessTokenLifeTime, refreshTokenLifeTime } from '../constans/auth.js';

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

const verifyEmailPath = path.join(TEMPLATES_DIR, 'verify-email.html');
const appDomain = getEnvVar('APP_DOMAIN');
const jwtSecret = getEnvVar('JWT_SECRET');

export const registerUser = async (payload) => {
  const { email } = payload;
  const user = await userCollection.findOne({ email: payload.email });
  // const user = await findUser({ email });
  if (user) {
    throw createHttpError(409, 'Email already in use');
  }
  const hashPassword = await bcrypt.hash(payload.password, 10);
  const newUser = await userCollection.create({
    ...payload,
    password: hashPassword,
  });

  const token = jwt.sign({ email }, jwtSecret, { expiresIn: '25h' });

  const templateSource = await fs.readFile(verifyEmailPath, 'utf-8');

  const template = Handlebars.compile(templateSource);

  const html = template({
    verifyLink: `${appDomain}/auth/verify?token=${token}`,
  });
  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html,
  };
  await sendEmail(verifyEmail);
  return newUser;
};

export const verifyUser = (token) => {
  try {
    const { email } = jwt.verify(token, jwtSecret);
    return userCollection.findOneAndUpdate({ email }, { verify: true });
  } catch (error) {
    throw createHttpError(401, error.message);
  }
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
