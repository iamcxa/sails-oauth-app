// eslint-disable-next-line valid-jsdoc
/**
 * sessionAuth
 *
 */
module.exports = function jwtEncode(req, res, next) {
  req.wantsJWT = true;
  return next();
};
