const passport = require('passport');

module.exports = {


  friendlyName: 'Google oAuth API handler',


  description: 'oAuth Google',


  inputs: {

  },


  exits: {

    success: {
      description: 'Redirect to google successfully.',
    },

  },


  fn: async function (inputs, exits, env) {

    const { req, res, next } = env;

    passport.authenticate('google', { scope: ['email', 'profile'] })(req, res, next);
  }


};
