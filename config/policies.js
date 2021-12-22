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
  '*': ['passport', 'jwt-decode', 'is-authenticated'],

  // all path under `auth` path bypass the logged in check because it accepts the auth request.
  'auth/*': ['passport'],

  // Bypass the `is-authenticated` policy for:
  'entrance/*': true,
  'view-homepage-or-redirect': 'passport',
  'view-faq': true,
  'view-contact': true,
  'legal/view-terms': true,
  'legal/view-privacy': true,
  'deliver-contact-form-message': true,

  'dashboard/view/*': ['passport', 'is-authenticated'],
  'account/view/*': ['passport', 'is-authenticated'],

  'account/logout': ['passport'],
  'entrance/confirm-email': ['passport'],
  'entrance/update-password-and-login': ['passport'],
  'entrance/login': ['passport'],
  'entrance/signup': ['passport'],
};
