import mysql from 'mysql';
import AbstractTestBed from './abstractOld';

jest.mock('jsonwebtoken');
jest.mock('mysql');

class TestBed extends AbstractTestBed {
    constructor() {
        super();
        this.setupDBMockup();
    }

    setupDBMockup() {
        const self = this;
        this.connectionQuery = jest.fn().mockImplementation((query, values, cb) => cb());
        this.dbPoolMock = {
            query: jest.fn(),
            escape: f => f,
            getConnection: cb =>
                cb(null, {
                    release: f => f,
                    destroy: f => f,
                    escape: f => f,
                    commit: cb => cb(),
                    rollback: cb => cb(),
                    beginTransaction: cb => cb(),
                    query: self.connectionQuery
                }),
            on: jest.fn()
        };
        mysql.createPool.mockImplementation(() => this.dbPoolMock);
        return mysql;
    }

    setupDBQueryMockup(mock) {
        this.dbPoolMock.query = mock;
        this.connectionQuery = mock;
    }

    resetDBPoolMockup() {
        for (let key of Object.keys(this.dbPoolMock)) {
            this.dbPoolMock[key] = jest.fn();
        }
    }

    createAuthQueryMockup() {
        return jest
            .fn()
            .mockImplementationOnce((query, values, cb) => {
                cb(null, [this.dummies.tokenDummy]);
                return { sql: '' };
            })
            .mockImplementationOnce((query, values, cb) => {
                cb(null, [this.dummies.userDummy]);

                return { sql: '' };
            });
    }

    checkAuthQueryMockupCallsFor(mockup, token) {
        const [
            [tokenCallQuery, tokenCallValues, tokenCallQueryCallback],
            [userCallQuery, userCallValues, userCallQueryCallback]
        ] = mockup.mock.calls;

        expect(tokenCallQuery).toEqual(this.expectations.tokenQuery);
        expect(tokenCallValues).toEqual([token]);
        expect(tokenCallQueryCallback).toBeTruthy();

        expect(userCallQuery).toEqual(this.expectations.userQuery);
        expect(userCallValues).toEqual([1]);
        expect(userCallQueryCallback).toBeTruthy();
    }
}

export default new TestBed();