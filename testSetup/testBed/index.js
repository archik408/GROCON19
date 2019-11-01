import mysql from 'mysql';
import AbstractTestBed from './abstract';

jest.mock('mysql');
jest.mock('jsonwebtoken');

class TestBed extends AbstractTestBed {
    constructor() {
        super();
        this.setupDBMockups();
    }

    setupDBMockups() {
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
}

export default new TestBed();
