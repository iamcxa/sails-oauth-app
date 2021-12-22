module.exports = {
  friendlyName: 'Login user effects',

  description: 'Set logged in user data into request and session',

  sync: false,

  inputs: {
    req: {
      type: 'ref',
      readOnly: false,
      required: true,
    },

    user: {
      type: 'ref',
      readOnly: false,
      required: true,
    },

    strategy: {
      type: 'string',
      readOnly: true,
      defaultsTo: 'local',
    },

    jwt: {
      type: 'ref',
      readOnly: true,
    },
  },

  fn: async function({req, user, strategy, jwt}, exits) {
    const loggedUser = await sails.services.user.get({id: user.id});
    // increase the logged in counts
    loggedUser.loggedInCount += 1;

    // save the count value and store it into `me` in req
    req.me = await loggedUser.save().toJSON();

    // Modify the active session instance.
    // (This will be persisted when the response is sent.)
    req.session.userId = loggedUser.id;

    // set a strategy value for later usage
    req.session.strategy = strategy;

    // set flag for some usage
    req.session.authenticated = true;

    // set jwt iat
    if (jwt) {
      req.session.jwt = jwt;
    }

    // In case there was an existing session (e.g. if we allow users to go to the login page
    // when they're already logged in), broadcast a message that we can display in other open tabs.
    if (sails.hooks.sockets) {
      await sails.helpers.broadcastSessionChange(req);
    }

    return exits.success(loggedUser);
  },
};
