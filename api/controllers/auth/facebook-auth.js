const passport = require('passport');

module.exports = {
  friendlyName: 'OAuth',

  description: 'oAuth facebook',

  inputs: {},

  exits: {
    success: {
      description: 'Redirect to facebook successfully.',
    },
  },

  fn: async function(inputs, exits, env) {
    const {req, res} = env;

    passport.authenticate('facebook', {scope: ['email', 'public_profile']})(
      req,
      res,
      res.next,
    );
  },
};
