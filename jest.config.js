module.exports = {
    collectCoverageFrom: [
        'routes/**/*.js',
        'config/**/*.js',
        'services/**/*.js',
        'middlewares/**/*.js',
        'assets/**/*.js',
        'seeds/**/*.js',
        '!<rootDir>/node_modules/'
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 80,
            lines: 75,
            statements: 75
        }
    },
    globalSetup: './testSetup/jest/setup.js',
    globalTeardown: './testSetup/jest/teardown.js',
    testEnvironment: './testSetup/jest/testEnvironment.js',
    testMatch: [
        '**/__tests__/*.test.js',
        '**/__tests__/*.contract.js',
        '**/__tests__/*.e2e.js'
    ]
};
