parasails.registerPage('account-overview', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    RESEND_VERIFY_EMAIL_DELAY: 4000,

    profile: {},

    // For <ajax-form>
    formData: { /* … */ },
    formRules: { /* … */ },
    formErrors: { /* … */ },
    cloudError: '',
    syncing: '',
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    _.extend(this, window.SAILS_LOCALS);
  },
  mounted: async function() {
    // …

    const res = await Cloud.getAccount();
    // .setHeaders({
    //   'Authorization': parasails.require('Authorization'),
    // });
    console.log('res=>', res);

    this.profile = res.data;
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    resendEmailVerification: async function() {
      const message = 'Are you sure you want to resend the verification email?' +
        ' please check spam mail box as well.';

      if (confirm(message)) {
        this.syncing = true;
        try {
          const result = await Cloud.resendVerificationEmail();

          if (result.success) {
            setTimeout(() => {
              this.syncing = false;
            }, this.RESEND_VERIFY_EMAIL_DELAY);
          }
        } catch (e) {
          this.syncing = false;
          alert(e.responseInfo.body.message);

          if (e.responseInfo.statusCode === 409) {
            if (confirm('Will you like to refresh current page?')) {
              window.location.reload();
            }
          }
          console.error(JSON.stringify(e));
        }
      }
    },

    removeAccount: async function() {
      const message = 'ARE YOU SURE TO REMOVE THE ACCOUNT? ' +
        'you will lose all of you`re data, you can register a new account by the same email later.';

      if (confirm(message)) {
        try {
          const result = await Cloud.deleteAccount();

          if (result.success) {
            window.location = '/login';
          }
        } catch (e) {
          alert(e.message);
          console.error(e);
        }
      }
    },

  },
});
