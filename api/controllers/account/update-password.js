module.exports = {
  /**
   * @swagger
   *
   * /update-password:
   *   security:
   *     - bearer: []
   *   tags:
   *     - Account
   */

  friendlyName: 'Account',

  description: 'Update the password for the logged-in user.',

  inputs: {
    password: {
      description: 'The new, unencrypted password.',
      example: 'abc123v2',
      required: true,
    },
  },

  fn: async function({password}) {
    // Update the record for the logged-in user.
    const user = await sails.services.user.get({id: this.req.me.id});
    user.password = password;
    user.oauthSkipPassword = false;

    this.req.me = await user.save();

    return this.res.ok(`response.success.update-password`);
  },
};
