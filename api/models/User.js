/* eslint-disable max-len */

const hashPassword = async function(instance) {
  if (instance.changed('password')) {
    // Storing passwords in plaintext in the database is terrible.
    // Hashing the value with an appropriate cryptographic hash function is better.
    instance.password = await sails.helpers.passwords.hashPassword(instance.password);
  }
  // return instance;
};

/**
 * User.js
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

    index: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },

    identifier: {
      type: Sequelize.STRING(191),
      unique: true,
    },

    emailAddress: {
      type: Sequelize.STRING(191),
      allowNull: false,
      unique: true,
    },

    emailStatus: {
      type: Sequelize.ENUM('unconfirmed', 'change-requested', 'confirmed'),
      defaultValue: 'confirmed',

      description: 'The confirmation status of the user\'s email address.',
      extendedDescription: `Users might be created as "unconfirmed" (e.g. normal signup) or as "confirmed" (e.g. hard-coded
admin users).  When the email verification feature is enabled, new users created via the
signup form have \`emailStatus: 'unconfirmed'\` until they click the link in the confirmation email.
Similarly, when an existing user changes their email address, they switch to the "change-requested"
email status until they click the link in the confirmation email.`,
    },

    emailChangeCandidate: {
      type: Sequelize.STRING(191),
      unique: true,

      description:
        'A still-unconfirmed email address that this user wants to change to (if relevant).',
    },

    password: {
      type: Sequelize.STRING(191),
      description: 'Securely hashed representation of the user\'s login password.',
      example: '2$28a8eabna301089103-13948134nad',
      protect: true,
    },

    oauthSkipPassword: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      description: 'Securely hashed representation of the user\'s login password.',
    },

    fullName: {
      type: Sequelize.STRING(191),
      allowNull: false,
      description: 'Full representation of the user\'s name.',
      example: 'Mary Sue van der McHenst',
    },

    locale: {
      type: Sequelize.STRING(45),
      defaultValue: 'zh-TW',
      description: 'User`s locale',
      example: 'zh-TW',
    },

    passwordResetToken: {
      type: Sequelize.STRING(191),
      description:
        'A unique token used to verify the user\'s identity when recovering a password.  Expires after 1 use, or after a set amount of time has elapsed.',
    },

    passwordResetTokenExpiresAt: {
      type: Sequelize.BIGINT,
      description:
        'A JS timestamp (epoch ms) representing the moment when this user\'s `passwordResetToken` will expire (or 0 if the user currently has no such token).',
      example: 1502844074211,
    },

    emailProofToken: {
      type: Sequelize.STRING(191),
      description:
        'A pseudorandom, probabilistically-unique token for use in our account verification emails.',
    },

    emailProofTokenExpiresAt: {
      type: Sequelize.BIGINT,
      description:
        'A JS timestamp (epoch ms) representing the moment when this user\'s `emailProofToken` will expire (or 0 if the user currently has no such token).',
      example: 1502844074211,
    },

    tosAcceptedByIp: {
      type: Sequelize.STRING(191),
      description:
        'The IP (ipv4) address of the request that accepted the terms of service.',
      extendedDescription:
        'Useful for certain types of businesses and regulatory requirements (KYC, etc.)',
      moreInfoUrl: 'https://en.wikipedia.org/wiki/Know_your_customer',
    },

    userAgent: {
      type: Sequelize.STRING(255),
    },

    lastSeenAt: {
      type: Sequelize.BIGINT,
      description:
        'A JS timestamp (epoch ms) representing the moment at which this user most recently interacted with the backend while logged in (or 0 if they have not interacted with the backend at all yet).',
      example: 1502844074211,
    },

    isSuperAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },

    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },

    deactivatedAt: {
      type: Sequelize.BIGINT,
    },

    expiredAt: {
      type: Sequelize.BIGINT,
    },

    loggedInCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  },

  associations() {
    sails.models.user.hasMany(sails.models.passport);
  },

  options: {
    scopes: require('@/scopes/user'),

    paranoid: true,

    timestamps: true,

    hooks: {
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword,
    },
  },
};
