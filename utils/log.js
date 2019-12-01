const chalk = require('chalk');
module.exports = {
  log(text) {
    console.log(chalk.cyan(`  ${text}\n`));
  },
  error(text) {
    console.error(chalk.red(` ${text}\n`));
    throw Error(text);
  },
  warn(text) {
    console.log(chalk.yellow(` ${text}\n`));
  }
};
