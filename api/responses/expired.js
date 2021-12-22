// eslint-disable-next-line valid-jsdoc
/**
 * expired.js
 *
 * A custom response that content-negotiates the current request to either:
 *  • serve an HTML error page about the specified token being invalid or expired
 *  • or send back 498 (Token Expired/Invalid) with no response body.
 *
 * Example usage:
 * ```
 *     return res.expired();
 * ```
 *
 * Or with actions2:
 * ```
 *     exits: {
 *       badToken: {
 *         description: 'Provided token was expired, invalid, or already used up.',
 *         responseType: 'expired'
 *       }
 *     }
 * ```
 */
module.exports = async function expired(
  data = 'response.expired.token_expired_or_invalid',
  options,
) {
  return sails.helpers.sendResponse.with({
    data,
    options,
    env: this,
    statusCode: 498,
    callback: async (req, res, payload) => {
      return payload;
    },
  });
};
