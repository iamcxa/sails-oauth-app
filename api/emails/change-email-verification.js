module.exports = function({emailAddress, fullName, emailProofToken}) {
  return {
    to: emailAddress,
    subject: 'Your account has been updated',
    template: 'email-verify-new-email',
    templateData: {
      fullName,
      token: emailProofToken,
    },
  };
};
