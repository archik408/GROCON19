const AUTHENTICATION_TOKEN_SEEDS = [
    {
        userID: 1,
        token: '222e45yJ0eXAi',
        expiresAt: new Date(new Date().getTime() + 10000),
        isValid: true
    },
    {
        userID: 3,
        token: '222e45yJ0eXAi',
        expiresAt: new Date(new Date().getTime() + 10000),
        isValid: true
    }
];

exports.authenticationTokenSeeds = AUTHENTICATION_TOKEN_SEEDS;
exports.seed = function insertAuthenticationTokenRows(knex) {
    return knex('authenticationToken')
        .del()
        .then(() => knex('authenticationToken').insert(AUTHENTICATION_TOKEN_SEEDS));
};
