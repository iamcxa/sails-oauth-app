module.exports = {
  friendlyName: 'View set password',

  description: 'Display "Set password" page when user signup with OAuth.',

  exits: {
    success: {
      viewTemplatePath: 'pages/account/set-password',
    },

    redirect: {
      description: 'The requesting user not yet logged in.',
      responseType: 'redirect',
    },
  },

  fn: async function() {
    if (!this.req.user || !this.req.session.userId) {
      // eslint-disable-next-line no-throw-literal
      throw {redirect: sails.config.paths.login};
    }

    return {
      provider: this.req.session.passport.strategy.toUpperCase(),
    };
  },
};
