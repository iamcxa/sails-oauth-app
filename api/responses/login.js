/**
 * 200 (login) Response
 *
 * @example
 * Usage:
 * return res.login();
 * return res.login(data);
 * return res.login('auth/login');
 * return res.login(data, 'auth/login');
 *
 * @param  {String|Object} data
 * @param  {String|Object} options
 *          - pass string to render specified view
 * @return {Object|Any} response
 */
module.exports = async function login(data = 'response.success.login', options) {
  return sails.helpers.sendResponse.with({
    data,
    options,
    env: this,
    statusCode: 200,
    callback: async (req, res, payload) => {
      const {user: User} = sails.models;
      const {identifier, password, rememberMe} = data;

      // Look up by the email address.
      // (note that we lowercase it to ensure the lookup is always case-insensitive,
      // regardless of which database we're using)
      const userRecord = await User.findOne({
        where: {
          [Sequelize.Op.or]: [
            {emailAddress: identifier.toLowerCase()},
            {identifier: identifier.toLowerCase()},
          ],
        },
      });

      // If there was no matching user, respond unauthorized.
      if (!userRecord) {
        return res.unauthorized('response.unauthorized.not-found');
      }

      // if the current request account has no setup a password...
      if (!userRecord.password && !userRecord.oauthSkipPassword) {
        return res.unauthorized('response.unauthorized.no-password');
      }

      // If the password doesn't match, then also exit thru "badCombo".
      try {
        await sails.helpers.passwords.checkPassword(password, userRecord.password);
      } catch (e) {
        return res.unauthorized(`response.unauthorized.${e.code}`);
      }

      // If "Remember Me" was enabled, then keep the session alive for
      // a longer amount of time.  (This causes an updated "Set Cookie"
      // response header to be sent as the result of this request -- thus
      // we must be dealing with a traditional HTTP request in order for
      // this to work.)
      if (rememberMe) {
        if (req.isSocket) {
          sails.log.warn(
            'Received `rememberMe: true` from a virtual request, but it was ignored\n' +
              'because a browser\'s session cookie cannot be reset over sockets.\n' +
              'Please use a traditional HTTP request instead.',
          );
        } else {
          req.session.cookie.maxAge = sails.config.custom.rememberMeCookieMaxAge;
        }
      } // ﬁ

      // increase the logged in counts
      userRecord.loggedInCount += 1;

      // Modify the active session instance.
      // (This will be persisted when the response is sent.)
      req.session.userId = userRecord.id;
      req.session.authenticated = true;
      req.session.me = await userRecord.save();

      // In case there was an existing session (e.g. if we allow users to go to the login page
      // when they're already logged in), broadcast a message that we can display in other open tabs.
      if (sails.hooks.sockets) {
        await sails.helpers.broadcastSessionChange(req);
      }

      if (req.wantsJWT) {
        payload.data = {
          Authorization: await sails.services.jwt.sign(
            {id: userRecord.id},
            {
              expiresIn: req.session.cookie.maxAge,
            },
          ),
          // url: targetUrl || params.successRedirect,
        };
      }
      return payload;
    },
  });
};
