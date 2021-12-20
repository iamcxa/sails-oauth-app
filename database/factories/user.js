// bcryptjs and lodash are built-in of sails components
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const faker = require('faker');

module.exports = function(queryInterface) {
  const tableName = 'Users';
  return {
    bulkCreate: async function(override = [], options, attributes) {
      // assembling user data but take out role prop,
      // because it is not the origin prop of User model.
      const userData = await Promise.all(
        override.map(async (each) => {
          return _.omit(
            {
              id: faker.datatype.uuid(),
              emailAddress: faker.internet.email(),
              fullName: faker.name.findName(),
              createdAt: new Date(),
              updatedAt: new Date(),
              isActive: true,
              ...each,
              password: bcrypt.hashSync(each.password || '!111Aaaa'),
            },
            ['role'],
          );
        }),
      );

      // now, insert data to create new users.
      const result = await queryInterface.bulkInsert(
        tableName,
        userData,
        options,
        attributes,
      );

      // take out the users that we just inserted
      const userIds = userData.map((e) => e.id).join('","');
      const users = await queryInterface.sequelize.query(
        `SELECT id from Users where id in ("${userIds}");`,
        {nest: true},
      );

      // let's check users one by one and get the role from the input.
      for (const user of users) {
        const rawData = override.find((e) => e.id === result.id);
        const roleAuthority = rawData.role || 'user';

        // use plain: true to get single result of select query
        const roleId = await queryInterface.sequelize.query(
          `SELECT id from Roles where authority = '${roleAuthority}';`,
          {plain: true},
        );

        // now we can put the role id and user together, to create the associations.
        await queryInterface.bulkInsert('UserRoles', [
          {
            RoleId: roleId.id,
            UserId: user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      }

      return result;
    },
  };
};
