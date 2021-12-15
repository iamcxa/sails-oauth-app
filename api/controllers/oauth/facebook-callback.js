const passport = require('passport');

module.exports = {


  friendlyName: 'Facebook oAuth API callback handler',


  description: 'After Facebook gives the user authenticated, the server will redirect the path to this handler.',


  inputs: {
  },


  exits: {
  },


  fn: async function (inputs, exits, env) {

    const { req, res, next } = env;

    passport.authenticate('facebook', async (err, user) => {
      if(err) {
        sails.log.error('google callback error: ', err);

        // redirect to login page
        return res.redirect('/signup');
      } else {
        const {
          user: newUser,
          provider,
        } = await sails.helpers.userOauthSignup(user, req.ip);

        // Modify the active session instance.
        // (This will be persisted when the response is sent.)
        this.req.session.userId = newUser.id;

        // set a provider value for later usage
        this.req.session.provider = provider;

        // In case there was an existing session (e.g. if we allow users to go to the login page
        // when they're already logged in), broadcast a message that we can display in other open tabs.
        if (sails.hooks.sockets) {
          await sails.helpers.broadcastSessionChange(this.req);
        }

        if (!newUser.password.trim()) {
          return res.redirect('/account/set-password');
        }
        return res.redirect('/account');
      }
    })(req, res, next);

  }


};
