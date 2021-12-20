module.exports = {
  loginRequest: {
    emailAddress: {
      type: 'string',
      required: true,
      description: 'The email to try in this attempt, e.g. "irl@example.com".',
      in: 'json',
      example: 'abc@example.com',
    },

    password: {
      type: 'string',
      required: true,
      description: 'The unencrypted password to try in this attempt, e.g. "passwordlol".',
      in: 'json',
      example: '2$28a8eabna301089103-13948134nad',
    },

    rememberMe: {
      description: 'Whether to extend the lifetime of the user\'s session.',
      extendedDescription: `Note that this is NOT SUPPORTED when using virtual requests (e.g. sending
requests over WebSockets instead of HTTP).`,
      type: 'boolean',
    },
  },

  signupRequest: {
    emailAddress: {
      type: 'string',
      required: true,
      description: '',
      in: 'json',
      example: 'abc@example.com',
    },

    password: {
      type: 'string',
      required: true,
      description: '',
      in: 'json',
      example: '2$28a8eabna301089103-13948134nad',
    },

    fullName: {
      type: 'string',
      required: true,
      description: '',
      in: 'json',
      example: 'kent Chen',
    },
  },
};
