/**
 * <ajax-button>
 * -----------------------------------------------------------------------------
 * A button with a built-in loading spinner.
 *
 * @type {Component}
 *
 * @event click   [emitted when clicked]
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
  data: function (){
    return {
      //…\
      passwordInputType: 'password',
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
  <div class="form-group">
    <label :for="inputName">{{ label || 'New password' }}</label>

      <input class="form-control"
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
          class="btn btn-link btn-password-display"
          @click="triggerDisplayPassword()" >
          <i :class="passwordTriggerIcon" aria-hidden="true"></i>
      </button>

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
      return this.formErrors.password && !this.formErrors.password.includes('required');
    },

    showErrorMessage() {
      console.log('this.formErrors=>', this.formErrors)
      console.log('this.inputName=>', this.inputName)
      console.log('this.formErrors[this.inputName]=>', !!this.formErrors[this.inputName])
      return this.formErrors[this.inputName];
    },

  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    //…
  },
  mounted: async function(){
    //…
  },
  beforeDestroy: function() {
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
