'use strict';

var passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  request = require('request');
const config = require('../local');


var verifyHandler = function(req, token, tokenSecret, profile, done) {

  process.nextTick(function() {
    var url = 'https://graph.facebook.com/v2.10/me?access_token=%s&fields=id,email,first_name,last_name';
    url = url.replace('%s', token);

    var options = {method: 'GET', url: url, json: true};
    request(options, function (err, response) {
      if (err) {
        return done(null, null);
      }

      console.log('response.body=>', response)

      var data = {
        id: response.body.id,
        first_name: response.body.first_name,
        last_name: response.body.last_name,
        email: response.body.email,
          ...response.body,
      };

      // var data = {
      //   profile,
      //   token,
      //   tokenSecret,
      // };


      return done(null, data);
    });
  });
};

passport.use(new FacebookStrategy({
  clientID: config.custom.oAuth.facebook.clientId,
  clientSecret: config.custom.oAuth.facebook.clientSecret,
  callbackURL: '/api/v1/auth/facebook/callback',
  passReqToCallback: true
}, verifyHandler));
