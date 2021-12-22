const jwt = require('jsonwebtoken');
const jwtSecret = sails.config.session.secret;

module.exports = {
  /**
   * Sign provided payload and transform into string token.
   *
   *     @param {String} id
   *     @param {Number} expiresIn
   *     @param {String} strategy
   *     @param {Function} [callback]
   *
   *     @return {String} token
   */
  sign: async function(id, expiresIn = 0, strategy = 'local', callback) {
    const expiredAt = Date.now() + expiresIn;
    const token = jwt.sign(
      {
        id,
        str: strategy,
        // exp,
      },
      jwtSecret,
      {
        expiresIn: `${expiresIn}ms`,
      },
      callback,
    );
    return {
      token,
      expiresIn,
      expiredAt,
    };
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
