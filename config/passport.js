const passport = require('passport');

module.exports.passport = (function() {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    sails.models.user
      .deserializeUser(id)
      .then((res) => done(null, res))
      .catch((err) => done(err));
  });
  return passport;
})();
