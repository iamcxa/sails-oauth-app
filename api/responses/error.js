/**
 * 200 (OK) Response
 *
 * @example
 * Usage:
 * return res.ok();
 * return res.ok(data);
 * return res.ok(data, 'auth/login');
 *
 * @param  {String|Object} data
 * @param  {String|Object} options
 *          - pass string to render specified view
 * @return {Object|Any} response
 */
module.exports = async function sendOK(data = 'response.success.requested', options) {
  return sails.helpers.sendResponse.with({
    data,
    options,
    env: this,
    statusCode: 200,
    callback: (req, res, payload) => {
      return payload;
    },
  });
};
