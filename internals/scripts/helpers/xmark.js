const chalk = require('chalk');

/**
 * Adds mark cross symbol
 */

const addXMark = callback => {
  process.stdout.write(chalk.red(' ✘'));
  if (callback) callback();
};

module.exports = addXMark;