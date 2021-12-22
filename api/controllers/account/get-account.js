// const {
//   swagger,
//   apiRequest,
// } = sails.document.getRequestAndSwagger(__filename, 'getStatistics');

const moment = require('moment');
module.exports = {
  /**
   * @swagger
   *
   * /get-profile:
   *   security:
   *     - bearer: []
   *   tags:
   *     - Dashboard
   */
  // swagger,

  friendlyName: 'get-account',

  description: 'Get current logged in user account profile.',

  fn: async function() {
    // sails.log('this.req.session=>', this.req.session);

    const dateFormat = 'YYYY-MM-DD HH:mm:ss Z';

    // Timestamp of user sign up.
    const userCreatedAt = moment(this.req.user.createdAt).format(dateFormat);

    // Number of times logged in.
    const userLoggedInTimes = this.req.user.loggedInCount;

    // Timestamp of the last user session.
    // For users with cookies, session and login may be different, since the user may not need to log in to start a new session.
    const sessionIssuedAt = moment(this.req.session.cookie._expires)
      .subtract(this.req.session.cookie.originalMaxAge, 'ms')
      .format(dateFormat);

    return this.res.ok({
      data: {
        user: this.req.user,
        userCreatedAt,
        userLoggedInTimes,
        sessionIssuedAt,
        sessionExpiredAt: moment(this.req.session.cookie._expires).format(dateFormat),
      },
    });
  },
};
