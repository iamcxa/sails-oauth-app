// eslint-disable-next-line valid-jsdoc
/**
 * is-authenticated
 *
 * A simple policy that allows any request from an authenticated user.
 *
 * For more about how to use policies, see:
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 */
module.exports = async function(req, res, proceed) {
  // If `req.user` is set, then we know that this request originated
  // from a logged-in user.  So we can safely proceed to the next policy--
  // or, if this is the last policy, the relevant action.
  if (req.user) {
    // only redirect oAuthed user to set new password when their request view resource.
    if (
      !req.wantsJSON &&
      req.session.passport.strategy !== 'local' &&
      !req.user.oauthSkipPassword &&
      !req.user.password &&
      !req.url.includes('/api') &&
      !req.url.includes(sails.config.paths.oauthSetPassword)
    ) {
      sails.log(
        '...logged in user has not set password yet, so redirecting to set up page.',
      );
      res.redirect(sails.config.paths.oauthSetPassword);
    }
    return proceed();
  }

  // --•
  // Otherwise, this request did not come from a logged-in user.
  return res.unauthorized();
};
