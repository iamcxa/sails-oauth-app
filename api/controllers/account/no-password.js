module.exports = {
  /**
   * @swagger
   *
   * /no-password:
   *   security:
   *     - bearer: []
   *   tags:
   *     - Account
   */

  friendlyName: 'Account',

  description: 'Update the password for the logged-in user.',

  fn: async function() {
    // Update the record for the logged-in user.
    await User.update(
      {
        password: null,
        oauthSkipPassword: true,
      },
      {where: {id: this.req.user.id}},
    );

    return this.res.ok();
  },
};
