const commonConfig = require('./jest.config');

module.exports = {
    collectCoverageFrom: commonConfig.collectCoverageFrom,
    testMatch: ['**/__tests__/*.test.js'],
    testPathIgnorePatterns: ['/node_modules/']
};
