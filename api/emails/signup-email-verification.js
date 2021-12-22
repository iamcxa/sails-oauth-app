module.exports = function({emailAddress, fullName, emailProofToken}) {
  return {
    to: emailAddress,
    subject: 'Please confirm your account',
    template: 'email-verify-account',
    templateData: {
      fullName: fullName,
      token: emailProofToken,
    },
  };
};
