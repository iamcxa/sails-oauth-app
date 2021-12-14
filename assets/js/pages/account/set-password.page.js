

parasails.registerPage('set-password', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    // Main syncing/loading state for this page.
    syncing: false,

    // page config
    page: {
      passwordInputType: 'password',
    },

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
        // custom: (value) => { console.log('custom validation=>', value);}
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
    hasTypedInPassword() {
      return this.formErrors.password && !this.formErrors.password.includes('required');
    },

    passwordTriggerIcon() {
      return this.page.passwordInputType === 'password'
        ? 'fa fa-eye'
        : 'fa fa-eye-slash';
    }
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

    tiggerDisplayPassword() {
      this.page.passwordInputType =
        this.page.passwordInputType === 'password'
          ? 'text'
          : 'password';
    },

    formValidate() {
      if (this.$refs.form) {
        this.formErrors = this.$refs.form.validate(this.formData, {});
      }

      console.log('this=>', this);
      console.log('this.$refs.form.validate=>', this.$refs.form.validate);
    },

    showRuleCheckIcon(ruleKey) {
      return this.formErrors.password.includes(ruleKey)
        ? 'fa fa-circle-thin'
        : 'fa fa-check-circle';
    },

    checkMultpiRulesPass() {
      const errorRules = [
        this.formErrors.password.includes('minLowerString'),
        this.formErrors.password.includes('minUpperString'),
        this.formErrors.password.includes('minDigit'),
        this.formErrors.password.includes('minSpecialString'),
      ];
      return errorRules.filter(e => e).length <= 1
        ? 'fa fa-check-circle'
        : 'fa fa-circle-thin';
    },

    submittedForm: async function () {
      // Redirect to a different web page on success.
      // > (Note that we re-enable the syncing state here.  This is on purpose--
      // > to make sure the spinner stays there until the page navigation finishes.)
      this.syncing = true;
      window.location = '/account';
    },

  }
});
