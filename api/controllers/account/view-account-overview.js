module.exports = {


  friendlyName: 'View account overview',


  description: 'Display "Account Overview" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/account/account-overview',
    }

  },


  fn: async function () {

    const user = await User.findOne({ id: this.req.session.userId }).populate('passports');

    return {
      hasPassword: !!user.password.trim(),
      passports: (user.passports || []).map(e => e.provider),
    };

  }


};
