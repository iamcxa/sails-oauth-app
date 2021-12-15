/**
 * cloud.setup.js
 *
 * Configuration for this Sails app's generated browser SDK ("Cloud").
 *
 * Above all, the purpose of this file is to provide endpoint definitions,
 * each of which corresponds with one particular route+action on the server.
 *
 * > This file was automatically generated.
 * > (To regenerate, run `sails run rebuild-cloud-sdk`)
 */

Cloud.setup({

  /* eslint-disable */
  methods: {"confirmEmail":{"verb":"GET","url":"/email/confirm","args":["token"]},"logout":{"verb":"GET","url":"/api/v1/account/logout","args":[]},"deleteAccount":{"verb":"DELETE","url":"/api/v1/account","args":[]},"updatePassword":{"verb":"PUT","url":"/api/v1/account/update-password","args":["password"]},"noPassword":{"verb":"PUT","url":"/api/v1/account/no-password","args":[]},"updateProfile":{"verb":"PUT","url":"/api/v1/account/update-profile","args":["fullName","emailAddress"]},"resendVerificationEmail":{"verb":"POST","url":"/api/v1/account/resend-verification-email","args":[]},"login":{"verb":"PUT","url":"/api/v1/entrance/login","args":["emailAddress","password","rememberMe"]},"signup":{"verb":"POST","url":"/api/v1/entrance/signup","args":["emailAddress","password","fullName"]},"sendPasswordRecoveryEmail":{"verb":"POST","url":"/api/v1/entrance/send-password-recovery-email","args":["emailAddress"]},"updatePasswordAndLogin":{"verb":"POST","url":"/api/v1/entrance/update-password-and-login","args":["password","token"]},"deliverContactFormMessage":{"verb":"POST","url":"/api/v1/deliver-contact-form-message","args":["emailAddress","topic","fullName","message"]},"observeMySession":{"verb":"POST","url":"/api/v1/observe-my-session","args":[],"protocol":"io.socket"},"googleAuth":{"verb":"GET","url":"/api/v1/auth/google","args":[]},"googleCallback":{"verb":"GET","url":"/api/v1/auth/google/callback","args":[]},"facebookAuth":{"verb":"GET","url":"/api/v1/auth/facebook","args":[]},"facebookCallback":{"verb":"GET","url":"/api/v1/auth/facebook/callback","args":[]}}
  /* eslint-enable */

});
