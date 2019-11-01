const commonConfig = require('./jest.config');

module.exports = {
    ...commonConfig,
    testMatch: ['**/__tests__/*.e2e.js']
};
