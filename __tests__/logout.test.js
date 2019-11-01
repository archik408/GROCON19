import testBed from '../../../../../testSetup/testBed';

const expectedResponse = {
    message: 'Successfully logged out user 1 and invalidated token'
};
const expectedInvalidateTokenQuery = 'UPDATE authenticationToken SET isValid=? WHERE token=?';
const validTokenQuery = testBed
        .createAuthQueryMockup()
        .mockImplementationOnce((query, values, cb) => {
            cb(null);
            return { sql: '' };
        });

const token = 'test_token';

describe('User Logout Router', () => {
    describe('success cases:', () => {
        beforeEach(() => {
            testBed.setupDBQueryMockup(validTokenQuery);
        });

        it('should handle GET /users/logout', done => {
            testBed
                .getSUT()
                .get('/v0.1/user/logout')
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-type', /json/)
                .expect(200)
                .end((err, res) => {
                    expect(err).toBeFalsy();
                    expect(res.body).toEqual(expectedResponse);
                    expect(res.body.message).toBeTruthy();

                    testBed.checkAuthQueryMockupCallsFor(validTokenQuery, token);

                    const [
                        , , [tokenQuery, tokenValues, tokenQueryCallback]
                    ] = validTokenQuery.mock.calls;

                    expect(tokenQuery).toEqual(expectedInvalidateTokenQuery);
                    expect(tokenValues).toEqual([false, token]);
                    expect(tokenQueryCallback).toBeTruthy();

                    done();
                });
        });
    });
});























