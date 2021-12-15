module.exports = {


  friendlyName: 'Update password',


  description: 'Update the password for the logged-in user.',


  inputs: {

  },


  fn: async function ({}) {

    // Update the record for the logged-in user.
    await User.updateOne({ id: this.req.me.id })
      .set({
        password: ' ',
        oauthSkipPassword: true,
      });

    return this.res.ok();
  }


};
