/**
 * 401 (unauthorized) Response
 *
 * @example
 * Usage:
 * return res.unauthorized();
 * return res.unauthorized(data);
 * return res.unauthorized(data, 'auth/login');
 *
 * @param  {String|Object} data
 * @param  {String|Object} options
 *          - pass string to render specified view
 * @return {Object|Any} response
 */
module.exports = async function unauthorized(
  data = 'response.unauthorized.not_login',
  options,
) {
  return sails.helpers.sendResponse.with({
    data,
    options,
    env: this,
    statusCode: 401,
    callback: async function(req, res, payload) {
      if (!req.wantsJSON) {
        return res.redirect(sails.config.paths.login);
      }
      return payload;
    },
  });
};
