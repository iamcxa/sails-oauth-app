const faker = require('faker');

module.exports = function(queryInterface) {
  const tableName = 'Roles';
  return {
    bulkCreate: async function(override = [], options, attributes) {
      const items = override.map((each) => ({
        id: faker.datatype.uuid(),
        authority: faker.name.jobTitle(),
        title: faker.name.jobTitle(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        ...each,
      }));
      return queryInterface.bulkInsert(tableName, items, options, attributes);
    },
  };
};
