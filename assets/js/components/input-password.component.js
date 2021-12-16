/**
 * <input-password>
 * -----------------------------------------------------------------------------
 * A input component specific used for password
 *
 * @type {Component}
 *
 * @event change   [emitted when text change]
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('inputPassword', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: [
    'inputName',
    'formErrors',
    'formData',
    'label',
    'errorMessage',
    'focusFirst',
  ],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function () {
    return {
      //…\
      passwordInputType: 'password',
      noErrors: false,
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
  <div class="form-group">
    <label :for="inputName">{{ label || 'New password' }}</label>
      <i class="fa fa-check text-success" aria-hidden="true" v-if="noErrors"></i>
      <div class="d-flex flex-row border">
        <input class="form-control border-0"
               :id="inputName"
               :name="inputName"
               :type="passwordInputType"
               :class="[showErrorMessage ? 'is-invalid' : '']"
               v-model.trim="formData[inputName]"
               placeholder="••••••••"
               autocomplete="new-password"
               @change="change()"
               :focus-first="focusFirst">
        <button
            type="button"
            class="btn btn-link"
            @click="triggerDisplayPassword()" >
            <i :class="passwordTriggerIcon" aria-hidden="true"></i>
        </button>
      </div>

    <div class="invalid-feedback"
         v-if="showErrorMessage">
        {{ errorMessage || 'Please enter a VALID password or choose "Cancel".' }}
    </div>
  </div>
  `,

  computed: {

    passwordTriggerIcon() {
      return this.passwordInputType === 'password'
        ? 'fa fa-eye'
        : 'fa fa-eye-slash';
    },

    hasTypedInPassword() {
      return this.formErrors[this.inputName] && !this.formErrors[this.inputName].includes('required');
    },

    showErrorMessage() {
      return !!this.formErrors[this.inputName];
    },

  },

  watch: {

    formErrors: {
      deep: true,
      handler(val, oldVal) {
        const isValueChange = !val[this.inputName] !== oldVal[this.inputName];
        const noErrors = !val[this.inputName] && !!this.formData[this.inputName];

        if (isValueChange) {
          this.noErrors = noErrors;
        }
      },
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
  beforeDestroy: function () {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    change() {
      this.$emit('change');
    },

    triggerDisplayPassword() {
      this.passwordInputType =
        this.passwordInputType === 'password'
          ? 'text'
          : 'password';
    },
  },

});
