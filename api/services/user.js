module.exports = {
  get: async function({id}) {
    const {user: User} = sails.models;
    return User.scope({method: ['includeRole']}).findByPk(id, {
      nest: true,
    });
  },

  sendFirstSignedVerificationEmail: async function({
    fullName,
    emailAddress,
    emailProofToken,
  }) {
    if (sails.config.custom.verifyEmailAddresses) {
      // Send "confirm account" email
      // await sails.helpers.sendTemplateEmail.with({
      //   to: emailAddress,
      //   subject: 'Please confirm your account',
      //   template: 'email-verify-account',
      //   templateData: {
      //     fullName: fullName,
      //     token: emailProofToken,
      //   },
      // });
      await sails.helpers.sendTemplateEmail.with(
        require('@/emails/signup-email-verification')({
          fullName,
          emailAddress,
          emailProofToken,
        }),
      );
    } else {
      sails.log.info(
        'Skipping new account email verification... (since `verifyEmailAddresses` is disabled)',
      );
    }
  },

  sendChangeAddressVerificationEmail: async function({
    fullName,
    emailAddress,
    emailProofToken,
  }) {
    // await sails.helpers.sendTemplateEmail.with({
    //   to: emailAddress,
    //   subject: 'Your account has been updated',
    //   template: 'email-verify-new-email',
    //   templateData: {
    //     fullName,
    //     token: emailProofToken,
    //   },
    // });
    await sails.helpers.sendTemplateEmail.with(
      require('@/emails/change-email-verification')({
        fullName,
        emailAddress,
        emailProofToken,
      }),
    );
  },

  changeEmailStatusToConfirmed: async function({id}) {
    await User.update(
      {
        emailStatus: 'confirmed',
        emailProofToken: null,
        emailProofTokenExpiresAt: 0,
        emailChangeCandidate: null,
      },
      {where: {id}},
    );
    return User.findByPk(id, {nest: true, raw: true});
  },

  signup: async function({fullName, emailAddress, password, tosAcceptedByIp}) {
    const {user: User, role: Role} = sails.models;

    const existing = await User.findOne({
      where: {emailAddress},
      paranoid: false,
    });

    if (existing) {
      // eslint-disable-next-line no-throw-literal
      throw 'emailAlreadyInUse';
    }

    const user = await User.create(
      _.extend(
        {
          fullName,
          emailAddress,
          password,
          tosAcceptedByIp,
        },
        sails.config.custom.verifyEmailAddresses ?
          {
            emailProofToken: await sails.helpers.strings.random('url-friendly'),
            emailProofTokenExpiresAt:
                Date.now() + sails.config.custom.emailProofTokenTTL,
            emailStatus: 'unconfirmed',
          } :
          {},
      ),
    );

    const roleUser = await Role.findOne({where: {authority: 'user'}});

    await user.addRoles([roleUser]);

    return user;
  },
};
