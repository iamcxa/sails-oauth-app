module.exports = {
  friendlyName: 'View',

  description: 'Display "Account Overview" page.',

  exits: {
    success: {
      viewTemplatePath: 'pages/account/account-overview',
    },
  },

  fn: async function(input, exits, env) {
    const {user: User, passport: Passport} = sails.models;
    const user = await User.findOne({
      where: {id: this.req.session.userId},
      include: [Passport],
      nest: true,
    });

    // return {
    //   hasPassword: !user.password,
    //   passports: (user.Passports || []).map((e) => e.provider),
    // };
    return env.res.ok(
      {
        hasPassword: !!user.password,
        passports: (user.Passports || []).map((e) => e.provider),
      },
      {
        view: 'pages/account/account-overview',
      },
    );
  },
};
