/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  '*': ['jwt-encode', 'jwt-decode', 'passport', 'is-logged-in'],

  // all path under `oauth` path bypass the logged in check because it accepts the oauth request.
  'oauth/*': true,

  // this path is used for set up new password for oauth users
  'account/view-set-password': true,

  // Bypass the `is-logged-in` policy for:
  'entrance/*': true,
  'account/logout': true,
  'view-homepage-or-redirect': true,
  'view-faq': true,
  'view-contact': true,
  'legal/view-terms': true,
  'legal/view-privacy': true,
  'deliver-contact-form-message': true,

  // apply jwt flag
  'entrance/login': 'jwt-encode',
  'entrance/signup': 'jwt-encode',
};
