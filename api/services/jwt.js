const jwt = require('jsonwebtoken');
const jwtSecret = sails.config.session.secret;

module.exports = {
  /**
   * Sign provided payload and transform into string token.
   *
   *     @param {Object} payload
   *     @param {Object} options
   *     @param {Function} [callback]
   *
   *     @return {String} token
   */
  sign: async function(payload, options = {}, callback) {
    // FIXME: add JWT expiresIn https://github.com/auth0/node-jsonwebtoken
    return jwt.sign(
      payload,
      jwtSecret,
      {
        expiresIn: _.get(sails.config, 'session.cookie.maxAge', '24h'),
        ...options,
      },
      callback,
    );
  },

  /**
   *  Verify provided jwt token and return the decoded result.
   *
   *     @param {String} token
   *     @param {Object} options
   *     @param {Function} [callback]
   *
   *     @return {Object} decoded
   */
  verify: async function(token, options = {}, callback) {
    // FIXME: 加入檢查逾時設定
    return jwt.verify(token, jwtSecret, {...options}, callback);
  },
};
