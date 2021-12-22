const snakeCase = require('lodash/snakeCase');
// eslint-disable-next-line valid-jsdoc
/**
 * jwt-decode
 *
 */
module.exports = async function jwtDecode(req, res, next) {
  let token = req.headers.Authorization || req.headers.authorization;
  if (!req.wantsJSON || typeof token !== 'string' || !token) {
    return next();
  }
  try {
    if (token.includes('Bearer')) {
      token = token.replace('Bearer ', '');
    }
    const decoded = await sails.services.jwt.verify(token);

    const user = await sails.services.user.get({id: decoded.id});
    if (!user) {
      return res.unauthorized('response.unauthorized.not-found');
    }

    sails.log.info(
      `Requesting by user: '${user.fullName || user.identifier || user.emailAddress}'`,
    );

    return req.logIn(user, (err) =>
      res.loggedIn(err, user, decoded.str, decoded.exp - decoded.iat, next),
    );
  } catch (err) {
    sails.log.warn(err);
    return res.unauthorized(`response.unauthorized.${snakeCase(err.name)}`);
  }
};
