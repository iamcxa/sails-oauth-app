/**
 * Role.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

/**
 * @swagger
 *
 * /User:
 *   description: |
 *     You might write a short summary of how this **User** model works and what it represents here.
 *
 *   tags:
 *     - User (ORM)
 *     - User (ORM duplicate)
 *
 * /allActions:
 *   externalDocs:
 *     url: https://somewhere.com/yep
 *     description: Refer to these docs for more info
 *
 * /find:
 *   description: >
 *     _Alternate description_: Find a list of **User** records that match the specified criteria.
 *
 * tags:
 *
 *   - name: User (ORM)
 *     description: |
 *       A longer, multi-paragraph description
 *       explaining how this all works.
 *
 *       It is linked to more information.
 *
 *     externalDocs:
 *       url: https://somewhere.com/yep
 *       description: Refer to these docs
 *
 * components:
 *   examples:
 *     modelDummy:
 *       summary: A model example example
 *       value: dummy
 */

module.exports = {
  attributes: {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    authority: {
      type: Sequelize.STRING(45),
      allowNull: false,
      unique: true,
    },

    title: {
      type: Sequelize.STRING(191),
      allowNull: false,
    },

    description: {
      type: Sequelize.STRING(191),
      allowNull: true,
    },

    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
  },
  associations() {
    sails.models.user.Role = sails.models.user.belongsToMany(sails.models.role, {
      through: 'UserRoles',
      foreignKey: {
        name: 'UserId',
        as: 'Users',
      },
    });
    sails.models.role.User = sails.models.role.belongsToMany(sails.models.user, {
      through: 'UserRoles',
      foreignKey: {
        name: 'RoleId',
        as: 'Roles',
      },
    });
  },
  options: {
    paranoid: false,

    timestamps: true,
  },
};
