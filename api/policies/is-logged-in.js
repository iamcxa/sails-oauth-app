// eslint-disable-next-line valid-jsdoc
/**
 * is-logged-in
 *
 * A simple policy that allows any request from an authenticated user.
 *
 * For more about how to use policies, see:
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 */
module.exports = async function(req, res, proceed) {
  // If `req.me` is set, then we know that this request originated
  // from a logged-in user.  So we can safely proceed to the next policy--
  // or, if this is the last policy, the relevant action.
  // > For more about where `req.me` comes from, check out this app's
  // > custom hook (`api/hooks/custom/index.js`).
  if (req.me) {
    // only redirect oAuthed user to set new password when their request view resource.
    if (
      (!req.me.password || !req.me.password.trim()) &&
      !req.me.oauthSkipPassword &&
      !req.url.includes('/api')
    ) {
      sails.log(
        '...logged in user has not set password yet, so redirecting to set up page.',
      );
      res.redirect('/account/set-password');
    }
    return proceed();
  }

  // --•
  // Otherwise, this request did not come from a logged-in user.
  return res.unauthorized();
};
