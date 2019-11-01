const util = require('util');
const exec = util.promisify(require('child_process').exec);
const chalk = require('chalk');

module.exports = async function teardown() {
    console.log(chalk.whiteBright.bold('Stopping MySQL container...'));
    await exec(`docker stop ${global.__MYSQL_CONTAINER_ID__}`);
    console.log(chalk.greenBright(`MySQL container (${global.__MYSQL_CONTAINER_ID__}) was stopped successfully`));
};
