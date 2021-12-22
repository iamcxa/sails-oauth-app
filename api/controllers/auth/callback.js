const passport = require('passport');

module.exports = {
  friendlyName: 'OAuth',

  description:
    'After OAuth provider gives the user authenticated, the server will redirect the path to this handler.',

  inputs: {
    strategy: {
      type: 'string',
      required: true,
    },
  },

  fn: async function({strategy}, exits, env) {
    const {req, res, next} = env;

    passport.authenticate(
      strategy,
      {failureRedirect: sails.config.paths.login},
      async (err, profile) => {
        if (err) {
          sails.log.error('google callback error: ', err);

          // redirect to login page
          return res.redirect(sails.config.paths.signup);
        }
        const user = await sails.helpers.signupOauth(profile, req);

        return req.logIn(user, (err) => res.loggedIn(err, user, strategy));
      },
    )(req, res, next);
  },
};
