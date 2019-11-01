const knex = require('knex');
const NodeEnvironment = require('jest-environment-node');
const { knexOptions } = require('../../scripts/getConfig');

class TestEnvironment extends NodeEnvironment {
    constructor(config) {
        super(config);
        this.connection = null;
    }

    async setup() {
        this.global.__KNEX__ = knex(knexOptions);
        await super.setup();
    }

    async teardown() {
        await this.destroyConnection();
        await super.teardown();
    }

    async clearData() {
        const [tables] = await this.connection.raw('SHOW TABLES;');
        await Promise.all(
            tables.reduce((promises, table) => {
                const [tableName] = Object.values(table);

                if (
                    tableName === knexOptions.migrations.tableName ||
                    tableName === `${knexOptions.migrations.tableName}_lock`
                ) {
                    return promises;
                }

                return [this.connection(tableName).truncate(), ...promises];
            }, [])
        );
    }

    destroyConnection() {
        return new Promise((resolve, reject) => {
            this.global.__KNEX__.destroy(error => {
                if (error) {
                    reject(error);
                }

                this.connection = null;
                resolve();
            });
        });
    }
}

module.exports = TestEnvironment;
