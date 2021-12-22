const {execSync} = require('child_process');

/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function() {
  // bootstrap script to wipe all existing data and rebuild hard-coded data.
  if (sails.config.models.migrate !== 'drop' && sails.config.environment !== 'test') {
    // If this is _actually_ a production environment (real or simulated), or we have
    // `migrate: safe` enabled, then prevent accidentally removing all data!
    if (process.env.NODE_ENV === 'production' || sails.config.models.migrate === 'safe') {
      sails.log(
        'Since we are running with migrate: \'safe\' and/or NODE_ENV=production (in the "' +
          sails.config.environment +
          '" Sails environment, to be precise), skipping the rest of the bootstrap to avoid data loss...',
      );
    } // •
  } else {
    const isEnvAllowed =
      process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging';
    if (isEnvAllowed && sails.config.models.migrate === 'drop') {
      sails.log(
        'Running bootstrap script because it was forced...  (either `--drop` or `--environment=test` was used)',
      );

      // running script to seeding
      execSync('npm run undo');
      execSync('npm run seed');
    }
  }
};
