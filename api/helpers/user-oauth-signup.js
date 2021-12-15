module.exports = {


  friendlyName: 'Create user',


  description: 'Create user by input data',


  // sync: false,


  inputs: {

    data: {
      type: {},
      readOnly: true
    },

    ip: {
      type: 'string',
      readOnly: true
    },

  },


  fn: async function ({ data, ip }) {
    // Build up data for the new user record and save it to the database.
    try {
      let userRecord = await User.findOne({
        emailAddress: data.email.toLowerCase(),
      });

      sails.log('Helper: Before create new user, try to find if giving email existing.');

      userRecord
        ? sails.log(`\t...user ${userRecord.fullName} exists:`) && console.dir(userRecord)
        : sails.log('\t...user is not existing!');

      if (userRecord) {
        // update email confirmation status due to assume OAuth has been verified the email.
        userRecord = await sails.services.user.changeEmailStatusToConfirmed({ id: userRecord.id });

        // if userRecord exists and payload data has prop provider,
        // means an existing user using OAuth to sign in again, so save them as the same user.
        if (data.provider) {
          const passportRecord = await Passport.findOne({
            userId: userRecord.id,
            provider: data.provider,
          });

          // if it has prop provider but has no passportRecord,
          //`means that current logining user has not created OAuth passport yet.
          if (!passportRecord) {
            await Passport.create({
              provider: data.provider,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              refreshedAt: Date.now(),
              userId: userRecord.id,
            })
              .intercept({name: 'UsageError'}, 'invalid')
              .fetch();
          }
        }
        return {
          user: userRecord,
          provider: data.provider || 'local',
        };
      }

      const newUserRecord = await User.create(_.extend({
        fullName: data.fullName,
        emailAddress: data.email,
        password: data.password,
        tosAcceptedByIp: ip,
        emailStatus: data.emailStatus,
        locale: data.locale,
        isSuperAdmin: data.isSuperAdmin,
      }, sails.config.custom.verifyEmailAddresses && data.emailStatus !== 'confirmed' ? {
        emailProofToken: await sails.helpers.strings.random('url-friendly'),
        emailProofTokenExpiresAt: Date.now() + sails.config.custom.emailProofTokenTTL,
        emailStatus: 'unconfirmed'
      } : {}))
        .intercept('E_UNIQUE', 'emailAlreadyInUse')
        .intercept({name: 'UsageError'}, 'invalid')
        .fetch();

      sails.log(`\t...user ${newUserRecord.fullName} created successfully.`);

      if (data.provider) {
        const passportRecord = await Passport.findOne({
          userId: newUserRecord.id,
          provider: data.provider,
        });

        if (!passportRecord) {
          await Passport.create({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            refreshedAt: Date.now(),
            provider: data.provider,
            userId: newUserRecord.id,
          })
            .fetch();

          sails.log(`\t...OAuth passport "${data.provider}" created successfully.`);
        }
      }
      return {
        user: newUserRecord,
        provider: data.provider || 'local',
      };
    } catch (e) {
      sails.log.error(e);

      throw e;
    }
  }


};

