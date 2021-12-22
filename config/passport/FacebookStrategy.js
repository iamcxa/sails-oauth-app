const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const request = require('request');
const config = require('../local');

module.exports['passport-facebook'] = (function() {
  const verifyHandler = function(req, token, tokenSecret, params, profile, done) {
    process.nextTick(() => {
      let url =
        'https://graph.facebook.com/v2.10/me?access_token=%s&fields=id,email,first_name,last_name';
      url = url.replace('%s', token);

      sails.log.verbose('params=>', params);
      const options = {method: 'GET', url: url, json: true};
      request(options, (err, response) => {
        if (err) {
          return done(null, null);
        }

        const data = {
          profile,

          accessToken: token,
          refreshToken: tokenSecret,
          provider: profile.provider || 'facebook',

          email: response.body.email,
          password: ' ', // `${Date.now()}${Math.random().toString(36).substr(2, 5)}}`,
          fullName: profile.displayName,
          emailStatus: 'confirmed',
        };

        return done(null, data);
      });
    });
  };

  passport.use(
    new FacebookStrategy(
      {
        clientID: config.custom.oAuth.facebook.clientId,
        clientSecret: config.custom.oAuth.facebook.clientSecret,
        callbackURL:
          process.env.NODE_ENV === 'production' ?
            config.custom.baseUrl + '/api/v1/auth/facebook/callback' :
            '/api/v1/auth/facebook/callback',
        passReqToCallback: true,
      },
      verifyHandler,
    ),
  );

  return passport;
})();
