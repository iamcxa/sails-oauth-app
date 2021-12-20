const lowerFirst = require('lodash/lowerFirst');

// eslint-disable-next-line valid-jsdoc
/**
 * jwt-decode
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = async function jwtDecode(req, res, next) {
  let token = req.headers.Authorization || req.headers.authorization;
  if (!req.wantsJWT) {
    return next();
  }
  try {
    if (typeof token !== 'undefined' && token) {
      if (token.includes('Bearer')) {
        token = token.replace('Bearer ', '');
      }
      const decoded = await sails.services.jwt.verify(token);
      sails.log('decoded jwt result=>\n', decoded);

      const user = await sails.services.user.find({id: decoded.id});
      if (!user) {
        return res.unauthorized('response.unauthorized.userNotFound');
      }
      req.session.authenticated = true;
      req.session.me = user;
      req.session.userId = user.id;
    }
    return next();
  } catch (err) {
    sails.log.warn(err);
    req.session.authenticated = false;
    req.session.passport = {
      user: null,
    };
    return res.unauthorized(`response.unauthorized.${lowerFirst(err.name)}`);
  }
};
