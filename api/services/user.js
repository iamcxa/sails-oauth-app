module.exports = {

  sendFirstSignedVerificationEmail: async function({ fullName, emailAddress, emailProofToken }) {

    if (sails.config.custom.verifyEmailAddresses) {
      // Send "confirm account" email
      await sails.helpers.sendTemplateEmail.with({
        to: emailAddress,
        subject: 'Please confirm your account',
        template: 'email-verify-account',
        templateData: {
          fullName: fullName,
          token: emailProofToken,
        },
      });
    } else {
      sails.log.info('Skipping new account email verification... (since `verifyEmailAddresses` is disabled)');
    }

  },

  sendChangeAddressVerificationEmail: async function({ fullName, emailAddress, emailProofToken }) {

    await sails.helpers.sendTemplateEmail.with({
      to: emailAddress,
      subject: 'Your account has been updated',
      template: 'email-verify-new-email',
      templateData: {
        fullName,
        token: emailProofToken
      }
    });

  },

  changeEmailStatusToConfirmed: async function({ id }) {

    return await User.updateOne({ id }).set({
      emailStatus: 'confirmed',
      emailProofToken: '',
      emailProofTokenExpiresAt: 0,
      emailChangeCandidate: '',
    });
  },

  signup: async function({ fullName, emailAddress, password, tosAcceptedByIp }) {

    return await User.create(_.extend({
      fullName,
      emailAddress,
      password: await sails.helpers.passwords.hashPassword(password),
      tosAcceptedByIp,
    }, sails.config.custom.verifyEmailAddresses? {
      emailProofToken: await sails.helpers.strings.random('url-friendly'),
      emailProofTokenExpiresAt: Date.now() + sails.config.custom.emailProofTokenTTL,
      emailStatus: 'unconfirmed'
    }:{}))
      .intercept('E_UNIQUE', 'emailAlreadyInUse')
      .intercept({name: 'UsageError'}, 'invalid')
      .fetch();
  },

};
