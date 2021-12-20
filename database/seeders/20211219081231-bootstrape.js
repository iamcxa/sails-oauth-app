/* eslint-disable no-console */
'use strict';
const UserFactory = require('../factories/user');
const RoleFactory = require('../factories/role');

module.exports = {
  up: async (queryInterface) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    try {
      console.log('Create Roles for Project...');
      await RoleFactory(queryInterface).bulkCreate([
        {
          authority: 'super-admin',
          title: 'Administrator',
          description: 'The Supreme permission administrators.',
        },
        {
          authority: 'user',
          title: 'User',
          description: 'Normal Users.',
        },
      ]);

      console.log('Create Admin Users for Project...');
      await UserFactory(queryInterface).bulkCreate([
        {
          emailAddress: 'admin@example.com',
          fullName: 'Ryan Dahl',
          password: 'abc123',

          isSuperAdmin: true,
          role: 'super-admin',
        },
      ]);

      console.log('Create Fake Users for Project...');
      await UserFactory(queryInterface).bulkCreate(
        new Array(4).fill({}).map((e, i) => ({
          emailAddress: `user${i}@example.com`,
          fullName: `user ${i}`,
          password: 'abc123',
        })),
      );
    } catch (e) {
      console.error(e);
    }
  },

  down: async (queryInterface) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
  },
};
