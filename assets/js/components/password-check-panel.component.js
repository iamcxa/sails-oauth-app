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

parasails.registerComponent('passwordCheckPanel', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: [
    'formErrors',
    'formData',
  ],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function (){
    return {
      //…\
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
  <div class="form-group">
      <ul class="list-unstyled" v-if="hasTypedInPassword">
          <li class="">
              <div class="">
                  <span class="c44756349">Your password must contain:</span>
                  <ul class="list-unstyled">
                      <li class="">
                          <i :class="showRuleCheckIcon('minLength')" aria-hidden="true"></i>
                          <span class="">At least 8 characters</span></li>
                      <li class="">
                          <i :class="checkMultiRulesPass()" aria-hidden="true"></i>
                          <span class="">At least 3 of the following:</span>
                          <div>
                              <ul>
                                <li class=""
                                    data-error-code="password-policy-lower-case">
                                    <i :class="showRuleCheckIcon('minLowerString')" aria-hidden="true"></i>
                                    <span class="c44756349">Lower case letters (a-z)</span></li>
                                <li class=""
                                    data-error-code="password-policy-upper-case">
                                    <i :class="showRuleCheckIcon('minUpperString')" aria-hidden="true"></i>
                                    <span class="c44756349">Upper case letters (A-Z)</span></li>
                                <li class=""
                                    data-error-code="password-policy-numbers">
                                    <i :class="showRuleCheckIcon('minDigit')" aria-hidden="true"></i>
                                    <span class="c44756349">Numbers (0-9)</span></li>
                                <li class=""
                                    data-error-code="password-policy-special-characters">
                                    <i :class="showRuleCheckIcon('minSpecialString')" aria-hidden="true"></i>
                                    <span class="c44756349">Special characters (ex. !@#$%^&amp;*)</span>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </li>
    </ul>
</div>
  `,

  computed: {

    hasTypedInPassword() {
      return this.formErrors.password && !this.formErrors.password.includes('required');
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

    showRuleCheckIcon(ruleKey) {
      return this.formErrors.password.includes(ruleKey)
        ? 'fa fa-circle-thin'
        : 'fa fa-check-circle';
    },

    checkMultiRulesPass() {
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

  },

});
