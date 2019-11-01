const util = require('util');
const exec = util.promisify(require('child_process').exec);
const knex = require('knex');
const chalk = require('chalk');
const config = require('../../scripts/getConfig');

const runMySqlDockerContainerCommand = `docker run -p ${config.DATABASE_PORT || 3306}:3306 \\
    --rm \\
    --name ${config.mysqlContainerName} \\
    -e MYSQL_ROOT_PASSWORD=root \\
    -e MYSQL_DATABASE=${config.DATABASE_NAME} \\
    -e MYSQL_USER=${config.DATABASE_USER} \\
    -e MYSQL_PASSWORD=${config.DATABASE_PASSWORD} \\
    -d mysql:5`;
const stopMySqlDockerContainer = `docker stop ${config.mysqlContainerName}`;

function checkConnection() {
    const maxConnectAttempts = 100;
    let connectAttempts = 0;

    console.log(chalk.whiteBright.bold('\nInitializing the MySQL database...'));

    return new Promise((resolve, reject) => {
        const timeout = setInterval(() => {
            const connection = knex(config.knexOptions);

            if (connectAttempts > maxConnectAttempts) {
                clearInterval(timeout);

                return reject(new Error('MySQL database is not available.'));
            }

            return connection
                .raw('show tables;')
                .then(() => {
                    clearInterval(timeout);
                    console.log(chalk.greenBright('MySQL database initialization is succeed.'));
                    resolve(connection);
                })
                .catch(() => {
                    connectAttempts += 1;
                });
        }, 1000);
    });
}

function destroyKnexConnection(connection) {
    return new Promise((resolve, reject) => {
        connection.destroy(error => (error ? reject(error) : resolve()));
    });
}

async function stopMySqlContainer() {
    try {
        const { stdout: mySqlContainerId } = await exec(stopMySqlDockerContainer);

        return mySqlContainerId;
    } catch (error) {
        if (!/No such container/i.test(error.stderr)) {
            console.error(error);
            return process.exit(1);
        }

        return undefined;
    }
}

async function runMySqlContainer() {
    try {
        const { stdout: mySqlContainerId } = await exec(runMySqlDockerContainerCommand);
        const connection = await checkConnection();

        console.log(chalk.whiteBright.bold('Performing migrations...'));
        await connection.migrate.latest();
        console.log(chalk.greenBright('All migrations were performed successfully.'));

        await destroyKnexConnection(connection);

        return mySqlContainerId.trim();
    } catch (error) {
        console.error(error);
        return process.exit(1);
    }
}

module.exports = async function setup() {
    await stopMySqlContainer();
    global.__MYSQL_CONTAINER_ID__ = await runMySqlContainer();
};
