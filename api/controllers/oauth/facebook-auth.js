const passport = require('passport');

module.exports = {


  friendlyName: 'facebook oAuth API handler',


  description: 'oAuth facebook',


  inputs: {

  },


  exits: {

    success: {
      description: 'Redirect to facebook successfully.',
    },

  },


  fn: async function (inputs, exits, env) {

    const {req, res, next} = env;

    passport.authenticate(
      'facebook',
      {scope: ['email', 'public_profile']})(req, res, next);

  }


};
