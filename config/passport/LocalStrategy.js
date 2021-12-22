const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports['passport-local'] = (async function() {
  passport.use(
    new LocalStrategy(
      {
        // using `emailAddress` as username field name(custom value)
        usernameField: 'emailAddress',

        // using `password` as username field name(origin default value)
        passwordField: 'password',

        // pass `req` reference into the callback
        passReqToCallback: true,
      },

      async (req, identifier, password, done) => {
        // Look up by the email address.
        // (note that we lowercase it to ensure the lookup is always case-insensitive,
        // regardless of which database we're using)
        const userRecord = await User.findOne({
          where: {
            [Sequelize.Op.or]: [
              {emailAddress: identifier.toLowerCase()},
              {identifier: identifier.toLowerCase()},
            ],
          },
        });

        // If there was no matching user, respond unauthorized.
        if (!userRecord) {
          return done('response.unauthorized.not_found', null);
        }

        // if the current request account has no setup a password...
        if (!userRecord.password && !userRecord.oauthSkipPassword) {
          return done('response.unauthorized.no_password', null);
        }

        // If the password doesn't match, then also exit thru "badCombo".
        try {
          const res = await userRecord.checkPassword(password, userRecord.password);
          return done(null, userRecord, res);
        } catch (e) {
          return done(`response.unauthorized.${e.code}`, null);
        }
      },
    ),
  );
})();
