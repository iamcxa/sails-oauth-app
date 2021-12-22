const config = require('../local');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports['passport-google'] = (function() {
  const verifyHandler = function(req, token, tokenSecret, params, profile, done) {
    const data = {
      // profile,
      accessToken: token,
      refreshToken: tokenSecret,
      provider: profile.provider || 'google',

      email: profile.emails[0].value,
      password: ' ', // `${Date.now()}${Math.random().toString(36).substr(2, 5)}}`,
      fullName: profile.displayName,
      emailStatus: profile.emails[0].verified ? 'confirmed' : 'unconfirmed',
    };

    sails.log.verbose('params=>', params);

    return done(null, data);
  };

  passport.use(
    new GoogleStrategy(
      {
        clientID: config.custom.oAuth.google.clientId,
        clientSecret: config.custom.oAuth.google.clientSecret,
        callbackURL:
          process.env.NODE_ENV === 'production' ?
            config.custom.baseUrl + '/api/v1/auth/google/callback' :
            '/api/v1/auth/google/callback',
        passReqToCallback: true,
      },
      verifyHandler,
    ),
  );

  return passport;
})();
