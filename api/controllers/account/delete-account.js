module.exports = {
  /**
   * @swagger
   *
   * /delete-account:
   *   security:
   *     - bearer: []
   *   tags:
   *     - Account
   */

  friendlyName: 'Account',

  description: 'Delete the account of logged-in user.',

  fn: async function() {
    const {user: User, passport: Passport} = sails.models;

    // Delete the user-related data record.
    await Passport.destroy({
      where: {
        userId: this.req.session.userId,
      },
    });
    await User.destroy({
      where: {id: this.req.session.userId},
    });

    // Clear the `userId` property from this session.
    delete this.req.session.userId;

    // Broadcast a message that we can display in other open tabs.
    if (sails.hooks.sockets) {
      await sails.helpers.broadcastSessionChange(this.req);
    }

    return this.res.ok();
  },
};
