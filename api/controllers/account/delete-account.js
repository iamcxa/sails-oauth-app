module.exports = {


  friendlyName: 'Delete account',


  description: 'Delete the account of logged-in user.',


  inputs: {

  },


  fn: async function ({}) {

    // Delete the user-related data record.
    await Passport.destroy({ userId: this.req.session.userId });
    await User.destroyOne({ id: this.req.session.userId });

    // Clear the `userId` property from this session.
    delete this.req.session.userId;

    // Broadcast a message that we can display in other open tabs.
    if (sails.hooks.sockets) {
      await sails.helpers.broadcastSessionChange(this.req);
    }

    return this.res.ok();
  }


};
