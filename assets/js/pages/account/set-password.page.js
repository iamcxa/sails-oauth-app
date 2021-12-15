parasails.registerPage('set-password', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    // Main syncing/loading state for this page.
    syncing: false,

    formAction: 'updatePassword',

    // Form data
    formData: { /* … */},

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: { /* … */},

    // Form rules
    formRules: {
      password: {
        required: true,
        minLength: 8,
        'minLowerString': 1,
        'minUpperString': 1,
        'minDigit': 1,
        'minSpecialString': 1,
      },
      confirmPassword: {required: true, sameAs: 'password'},
    },

    // Server error state for the form
    cloudError: '',
  },

  computed: {
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    //…
  },
  mounted: async function () {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    formValidate() {
      if (this.$refs.form) {
        this.formErrors = this.$refs.form.validate(this.formData, {});
      }
    },

    submittedForm: async function () {
      // Redirect to a different web page on success.
      // > (Note that we re-enable the syncing state here.  This is on purpose--
      // > to make sure the spinner stays there until the page navigation finishes.)
      this.syncing = true;
      window.location = '/account';
    },

    submittedFormWithSkipPass: async function () {

      this.formAction = 'noPassword';
      this.formRules = {};
      this.formErrors = {};

      // Redirect to a different web page on success.
      // > (Note that we re-enable the syncing state here.  This is on purpose--
      // > to make sure the spinner stays there until the page navigation finishes.)
      this.syncing = true;

      try {
        await Cloud.noPassword();
        window.location = '/account';
      } catch (e) {
        if (e.responseInfo.statusCode === 403) {
          window.location = '/login';
        } else if (e.responseInfo.statusCode === 500 || e.responseInfo.statusCode === 0) {
          alert('Oops something goes wrong. please try again later.');
        }
      }
    },

  }
});
