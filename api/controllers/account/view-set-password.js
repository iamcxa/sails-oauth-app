module.exports = {


  friendlyName: 'View set password',


  description: 'Display "Set password" page when user signup with OAuth.',


  exits: {

    success: {
      viewTemplatePath: 'pages/account/set-password'
    },

    redirect: {
      description: 'The requesting user not yet logged in.',
      responseType: 'redirect'
    },

  },


  fn: async function () {

    if (!this.req.me || !this.req.session.userId) {
      throw { redirect: '/login' };
    }

    return {
      provider: this.req.session.provider.toUpperCase(),
    };

  }


};
