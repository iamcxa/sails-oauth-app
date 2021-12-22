module.exports = {
  friendlyName: 'Logout user effects',

  description: 'Logout current user and clean all tracks',

  sync: false,

  inputs: {
    req: {
      type: 'ref',
      readOnly: false,
      required: true,
    },
  },

  fn: async function({req}, exits) {
    if (req.session.userId) {
      delete req.session.userId;
    }

    if (req.jwt) {
      delete req.jwt;
    }

    req.me = {};
    req.session.authenticated = false;
    req.session.destroy();
    req.logout && req.logout();

    // In case there was an existing session (e.g. if we allow users to go to the login page
    // when they're already logged in), broadcast a message that we can display in other open tabs.
    if (sails.hooks.sockets) {
      await sails.helpers.broadcastSessionChange(req);
    }

    return exits.success();
  },
};
