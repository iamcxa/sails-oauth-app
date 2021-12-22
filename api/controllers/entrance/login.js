const passport = require('passport');
const {swagger, apiRequest} = sails.document.getRequestAndSwagger(__filename);

module.exports = {
  /**
   * @swagger
   *
   * /login:
   *   security:
   *     - bearer: []
   *   tags:
   *     - Entrance
   */
  swagger,

  friendlyName: 'Login',

  description: 'Log in using the provided email and password combination.',

  extendedDescription: `This action attempts to look up the user record in the database with the
specified email address.  Then, if such a user exists, it uses
bcrypt to compare the hashed password from the database with the provided
password attempt.`,

  inputs: {
    emailAddress: {
      description: 'The email to try in this attempt, e.g. "irl@example.com".',
      type: 'string',
      required: true,
    },

    password: {
      description: 'The unencrypted password to try in this attempt, e.g. "passwordlol".',
      type: 'string',
      required: true,
    },

    rememberMe: {
      description: 'Whether to extend the lifetime of the user\'s session.',
      extendedDescription: `Note that this is NOT SUPPORTED when using virtual requests (e.g. sending
requests over WebSockets instead of HTTP).`,
      type: 'boolean',
    },
  },

  fn: async function(input, exits, env) {
    const {res, req} = env;

    const request = await env.req.validate(apiRequest);
    // return env.res.login({identifier: emailAddress, password, rememberMe});

    const strategy = 'local';

    passport.authenticate(
      strategy,
      {failureRedirect: sails.config.paths.login},
      async (err, user) => {
        if (err) {
          return res.unauthorized(err);
        }

        req.session.cookie.maxAge = _.get(
          sails.config,
          'session.cookie.maxAge',
          24 * 60 * 60 * 1000,
        );

        // If "Remember Me" was enabled, then keep the session alive for
        // a longer amount of time.  (This causes an updated "Set Cookie"
        // response header to be sent as the result of this request -- thus
        // we must be dealing with a traditional HTTP request in order for
        // this to work.)
        if (request.rememberMe) {
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

        return req.logIn(user, (err) =>
          res.loggedIn(err, user, strategy, req.session.cookie.maxAge),
        );
      },
    )(req, res, req.next);
  },
};
