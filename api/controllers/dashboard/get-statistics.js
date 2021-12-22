// const {
//   swagger,
//   apiRequest,
// } = sails.document.getRequestAndSwagger(__filename, 'getStatistics');

const moment = require('moment');

module.exports = {
  /**
   * @swagger
   *
   * /get-statistics:
   *   security:
   *     - bearer: []
   *   tags:
   *     - Dashboard
   */
  // swagger,

  friendlyName: 'get-statistics',

  description: 'Get the system statistics.',

  fn: async function() {
    const {user: User} = sails.models;

    // Total number of users who have signed up.
    const totalUsers = await User.count();

    // Total number of users with active sessions today.
    const activeUsersToday = await User.count({
      where: {
        lastSeenAt: {
          [Sequelize.Op.between]: [
            moment().startOf('day').valueOf(),
            moment().endOf('day').valueOf(),
          ],
        },
      },
    });

    // Average number of active session users in the last 7 days rolling.
    const activeUsersInWeek = await User.count({
      where: {
        lastSeenAt: {
          [Sequelize.Op.between]: [
            moment()
              .hours(0)
              .minutes(0)
              .seconds(0)
              .milliseconds(0)
              .subtract(7, 'days')
              .valueOf(),
            moment().endOf('day').valueOf(),
          ],
        },
      },
    });
    return this.res.ok({
      data: {
        totalUsers,
        activeUsersToday,
        averageActiveUsersIn7days: +(Math.round(activeUsersInWeek / 7 + 'e+2') + 'e-2'),
      },
    });
  },
};
