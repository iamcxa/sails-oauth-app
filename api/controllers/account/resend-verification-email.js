module.exports = {
  /**
   * @swagger
   *
   * /resend-verification-email:
   *   security:
   *     - bearer: []
   *   tags:
   *     - Account
   */

  friendlyName: 'Account',

  description: 'Resend verification email to logged-in user.',

  inputs: {},

  exits: {
    emailAlreadyConfirmed: {
      statusCode: 409,
      description: 'Requesting user has already confirmed email address.',
    },
  },

  fn: async function(inputs, exits) {
    const user = await User.findOne({id: this.req.me.id});

    if (user.emailStatus !== 'confirmed') {
      // Extend emailProofTokenExpiresAt for the logged-in user.
      const {emailAddress, emailProofToken, fullName} = await user.update({
        emailProofTokenExpiresAt: Date.now() + sails.config.custom.emailProofTokenTTL,
        emailProofToken: await sails.helpers.strings.random('url-friendly'),
      });

      if (user.emailStatus === 'unconfirmed') {
        await sails.services.user.sendFirstSignedVerificationEmail({
          fullName,
          emailAddress,
          emailProofToken,
        });
      } else {
        await sails.services.user.sendChangeAddressVerificationEmail({
          fullName,
          emailAddress,
          emailProofToken,
        });
      }

      return this.res.ok();
    }

    return exits.emailAlreadyConfirmed({
      message: 'Your email address already confirmed, please refresh your page.',
    });
  },
};
