const USER_SEEDS = [
    {
        id: 1,
        firstName: 'Jhon',
        lastName: 'Doe'
    },
    {
        id: 3,
        firstName: 'Yen',
        lastName: 'Young'
    }
];

exports.userSeeds = USER_SEEDS;
exports.seed = function insertUserRows(knex) {
    return knex('user')
        .del()
        .then(() => knex('user').insert(USER_SEEDS));
};
