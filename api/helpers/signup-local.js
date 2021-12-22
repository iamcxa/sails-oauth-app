module.exports = {
  friendlyName: 'Create or find user by OAuth provider',

  description: 'Create user by input data',

  sync: false,

  inputs: {
    data: {
      type: 'ref',
      readOnly: true,
    },

    req: {
      type: 'ref',
      readOnly: true,
    },
  },

  fn: async function({data, req}) {
    const {user: User, role: Role, passport: Passport} = sails.models;
    // Build up data for the new user record and save it to the database.
    try {
      let userRecord = await User.findOne({
        where: {emailAddress: data.email.toLowerCase()},
        // raw: true,
        nest: true,
        paranoid: false,
      });

      sails.log('Helper: Before create new user, try to find if giving email existing.');

      userRecord ? // eslint-disable-next-line no-console
          sails.log(`\t...user ${userRecord.fullName} exists:`) && console.dir(userRecord) :
        sails.log('\t...user is not existing!');

      if (userRecord) {
        if (userRecord.deletedAt) {
          userRecord.deletedAt = null;
          await userRecord.restore();
        }
        // update email confirmation status due to assume OAuth has been verified the email.
        userRecord = await sails.services.user.changeEmailStatusToConfirmed({
          id: userRecord.id,
        });

        // if userRecord exists and payload data has prop provider,
        // means an existing user using OAuth to sign in again, so save them as the same user.
        if (data.provider) {
          const passportRecord = await Passport.findOne({
            where: {
              UserId: userRecord.id,
              provider: data.provider,
            },
          });

          // if it has prop provider but has no passportRecord,
          // `means that current logining user has not created OAuth passport yet.
          if (!passportRecord) {
            await Passport.create({
              provider: data.provider,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              refreshedAt: Date.now(),
              UserId: userRecord.id,
            });
          }
        }
        return userRecord;
      }

      const newUserRecord = await User.create(
        _.extend(
          {
            fullName: data.fullName,
            emailAddress: data.email,
            password: data.password,
            tosAcceptedByIp: req.ip,
            userAgent: req.headers['user-agent'],
            locales: req.headers['accept-language'],
            emailStatus: data.emailStatus,
            locale: data.locale,
            isSuperAdmin: data.isSuperAdmin,
          },
          sails.config.custom.verifyEmailAddresses && data.emailStatus !== 'confirmed' ?
            {
              emailProofToken: await sails.helpers.strings.random('url-friendly'),
              emailProofTokenExpiresAt:
                  Date.now() + sails.config.custom.emailProofTokenTTL,
              emailStatus: 'unconfirmed',
            } :
            {},
        ),
        {
          nest: true,
          raw: true,
        },
      );

      sails.log(`\t...user ${newUserRecord.fullName} created successfully.`);

      if (data.provider) {
        const passportRecord = await Passport.findOne({
          where: {
            UserId: newUserRecord.id,
            provider: data.provider,
          },
        });

        if (!passportRecord) {
          await Passport.create({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            refreshedAt: Date.now(),
            provider: data.provider,
            UserId: newUserRecord.id,
          });

          sails.log(`\t...OAuth passport "${data.provider}" created successfully.`);
        } else {
          passportRecord.accessToken = data.accessToken;
          passportRecord.refreshToken = data.refreshToken;
          await passportRecord.save();
        }
      }

      const roleUser = await Role.findOne({where: {authority: 'user'}});
      await newUserRecord.addRoles([roleUser]);

      return newUserRecord;
    } catch (e) {
      sails.log.error(e);

      throw e;
    }
  },
};
