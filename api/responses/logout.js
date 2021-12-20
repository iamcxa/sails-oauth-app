/**
 * 200 (logout) Response
 *
 * @example
 * Usage:
 * return res.logout();
 * return res.logout(data);
 * return res.logout(data, 'auth/login');
 *
 * @param  {String|Object} data
 * @param  {String|Object} options
 *          - pass string to render specified view
 * @return {Object|Any} response
 */
module.exports = async function logout(data = 'response.success.logout', options) {
  return sails.helpers.sendResponse.with({
    data,
    options,
    env: this,
    statusCode: 401,
    callback: (req, res, payload) => {
      if (req.session.userId) {
        delete req.session.userId;
      }
      req.session.authenticated = false;
      req.session.destroy();
      req.logout && req.logout();
      return payload;
    },
  });
};
