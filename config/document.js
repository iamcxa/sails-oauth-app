module.exports.document = {
  requests: {
    ...require('@/requests/enterance'),
    ...require('@/requests/account'),
  },
  responses: {
    ...require('@/samples/enterance'),
    ...require('@/samples/account'),
  },
};
