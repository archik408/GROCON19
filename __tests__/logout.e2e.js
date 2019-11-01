import testBed from '../../../../testSetup/testBed/integration';
import { authenticationTokenSeeds } from '../../../../testSetup/fixtures/db/authenticationToken';

const [tokenSeed] = authenticationTokenSeeds;
const { token } = tokenSeed;

describe('GET /users/logout', () => {
    beforeAll(async () => {
        await testBed.loadInitialData();
    });

    it('should response with OK status code (200) and success message if user logout is succeed', done => {
        testBed
            .getSUT()
            .get('/v0.1/user/logout')
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(err).toBeNull();
                expect(res.body).toEqual({ message: 'Successfully logged out user 1 and invalidated token' });

                done();
            });
    });
});
