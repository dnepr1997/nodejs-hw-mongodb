import createHttpError from 'http-errors';
import { userCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { sessionCollection } from '../db/models/session.js';
import { randomBytes } from 'node:crypto';
import { accessTokenLifeTime, refreshTokenLifeTime } from '../constans/auth.js';

export const findSession = (query) => sessionCollection.findOne(query);

export const findUser = (query) => userCollection.findOne(query);

export const registerUser = async (payload) => {
  const { email, password } = payload;

  const user = await findUser({ email });
  if (user) {
    throw createHttpError(209, 'Email already in use');
  }
  const hashPassword = await bcrypt.hash(password, 10);
  return await userCollection.create({ ...payload, password: hashPassword });
};

export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await findUser({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password invalid');
  }
  await sessionCollection.findOneAndDelete({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  return sessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + accessTokenLifeTime,
    refreshTokenValidUntil: Date.now() + refreshTokenLifeTime,
  });
};
