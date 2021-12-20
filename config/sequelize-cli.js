const get = require('lodash/get');
const {datastores} = require('./datastores');
const {connection} = require('./models');
let local = {};

try {
  local = require('./local');
} catch (e) {
  sails.log.info('[!] local overridden config not exist. ', e);
}

const {
  MYSQL_ENV_MYSQL_USER_NAME: username,
  MYSQL_ENV_MYSQL_USER_PASS: password,
  MYSQL_PORT_3306_TCP_ADDR: tcpAddress,
  MYSQL_PORT_3306_TCP_PORT: tcpPort,
} = process.env;

const source = get(local, 'models.connection', connection);
const mySqlPrefix = `datastores.${source}`;

const configStrings = {
  userNameLocal: `${mySqlPrefix}.user`,
  userNameDatastore: get(datastores, `${source}.user`),

  passwordLocal: `${mySqlPrefix}.password`,
  passwordDatastore: get(datastores, `${source}.password`),

  dbNameLocal: `${mySqlPrefix}.database`,
  dbNameDatastore: get(datastores, 'mysql.database', 'db'),

  hostLocal: `${mySqlPrefix}.options.host`,
  hostDatastore: get(datastores, 'mysql.options.host', '127.0.0.1'),

  portLocal: `${mySqlPrefix}.options.port`,
  portDatastore: get(datastores, 'mysql.options.port'),
};

const defaultConfig = {
  dialect: 'mysql',

  username:
    username || get(local, configStrings.userNameLocal, configStrings.userNameDatastore),

  password:
    password || get(local, configStrings.passwordLocal, configStrings.passwordDatastore),

  database: get(local, configStrings.dbNameLocal, configStrings.dbNameDatastore),

  host: tcpAddress || get(local, configStrings.hostLocal, configStrings.hostDatastore),

  port: tcpPort || get(local, configStrings.portLocal, configStrings.portDatastore),
};

module.exports = {
  development: defaultConfig,
  // production: Object.assign(defaultConfig, {database: 'db-prod'}),
};
