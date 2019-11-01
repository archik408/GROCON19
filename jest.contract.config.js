const commonConfig = require('./jest.config');

module.exports = {
    collectCoverageFrom: commonConfig.collectCoverageFrom,
    testMatch: ['**/__tests__/*.contract.js'],
    testPathIgnorePatterns: ['/node_modules/']
};
