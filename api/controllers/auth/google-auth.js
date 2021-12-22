const passport = require('passport');

module.exports = {
  friendlyName: 'OAuth',

  description: 'oAuth Google',

  inputs: {},

  exits: {
    success: {
      description: 'Redirect to google successfully.',
    },
  },

  fn: async function(inputs, exits, env) {
    const {req, res} = env;

    passport.authenticate('google', {scope: ['email', 'profile']})(req, res, req.next);
  },
};
