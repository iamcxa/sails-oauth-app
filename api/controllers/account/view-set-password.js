module.exports = {


  friendlyName: 'View set password',


  description: 'Display "Set password" page when user signup with OAuth.',


  exits: {

    success: {
      viewTemplatePath: 'pages/account/set-password'
    }

  },


  fn: async function () {

    return {
      provider: '123'
    };

  }


};
