/**
 * 200 (loggedIn) Response
 *
 * @example
 * Usage:
 * return res.loggedIn(error, user, strategy, expiresIn);
 * return res.loggedIn(error, user, strategy, expiresIn, next);
 *
 * @param  {Object} error
 * @param  {Object} user
 * @param  {String} strategy
 * @param  {Number} expiresIn
 * @param  {Function} [next]
 * @return {Object} response
 */
module.exports = async function loggedIn(
  error,
  user,
  strategy = 'local',
  expiresIn = _.get(sails.config, 'session.cookie.maxAge', 24 * 60 * 60 * 1000),
  next,
) {
  const {req, res} = this;

  if (error) {
    sails.log.error('error=>', error);

    if (!req.wantsJSON) {
      return res.redirect(sails.config.paths.login);
    }
    return res.unauthorized(`response.unauthorized.${error}`);
  }

  // Modify the active session instance.
  // (This will be persisted when the response is sent.)
  req.session.userId = user.id;

  // set a strategy value for later usage
  req.session.passport.strategy = strategy;

  // update cookie max age
  req.session.cookie.maxAge = expiresIn;

  // increase the logged in counts
  // do in background...
  {
    User.increaseLoggedInCount(user.id);
    User.updateLoggedInInformation(user.id, {
      userAgent: req.headers['user-agent'],
      locale: req.headers['accept-language'][0],
      ip: req.ip,
    });
  }

  // In case there was an existing session (e.g. if we allow users to go to the login page
  // when they're already logged in), broadcast a message that we can display in other open tabs.
  if (sails.hooks.sockets) {
    await sails.helpers.broadcastSessionChange(req);
  }

  // if pass a process function
  if (next) {
    return next();
  }

  // if request is not by API...
  if (!req.wantsJSON && strategy !== 'local') {
    if ((!user.password || !user.password.trim()) && !user.oauthSkipPassword) {
      return res.redirect(sails.config.paths.oauthSetPassword);
    }
    return res.redirect(sails.config.custom.redirectPathAfterOAuth);
  }

  return sails.helpers.sendResponse.with({
    data: {},
    options: {},
    env: this,
    statusCode: 200,
    callback: async (req, res, payload) => {
      const {token, expiredAt} = await sails.services.jwt.sign(
        user.id,
        expiresIn,
        strategy,
      );

      return {
        ...payload,
        message: 'response.success.logged_in',
        data: {
          Authorization: token,
          expiredAt,
          expiresIn,
        },
      };
    },
  });
};
