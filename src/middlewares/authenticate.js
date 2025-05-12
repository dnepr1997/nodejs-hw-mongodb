import createHttpError from 'http-errors';
import { sessionCollection } from '../db/models/session.js';
import { userCollection } from '../db/models/user.js';
// export const authenticate = async (req, res, next) => {
//   const authorization = req.get('Authorization');
//   if (!authorization) {
//     return next(createHttpError(401, 'Authorization header missing'));
//   }
//   const [bearer, accessToken] = authorization.split(' ');
//   if (bearer !== 'Bearer') {
//     return next(createHttpError(401, 'Header must have type Bearer'));
//   }
//   const session = await findSession({ accessToken });
//   if (!session) {
//     return next(createHttpError(401, 'Session not found'));
//   }
//   if (session.accessTokenValidUntil < Date.now()) {
//     return next(createHttpError(401, 'Access token expired'));
//   }
//   const user = await findUser({ _id: session.userId });
//   if (!user) {
//     return next(createHttpError(401, 'User not found'));
//   }
//   req.user = user;
//   next();
// };
export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    next(createHttpError(401, 'Please provide Authorization header'));
    return;
  }
  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];
  if (bearer !== 'Bearer' || !token) {
    next(createHttpError(401, 'Auth header should be of type Bearer'));
    return;
  }
  const session = await sessionCollection.findOne({ accessToken: token });
  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }
  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);
  if (isAccessTokenExpired) {
    next(createHttpError(401, 'Access token expired'));
    return;
  }
  const user = await userCollection.findById(session.userId);
  if (!user) {
    next(createHttpError(401));
    return;
  }
  req.user = user;
  next();
};
