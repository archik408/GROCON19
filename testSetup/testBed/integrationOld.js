import TestBedAbstract from './abstractOld';

jest.mock('../../assets/logger');

class TestBed extends TestBedAbstract {
    loadInitialData() {
        return global.__KNEX__.seed.run();
    }
}

export default new TestBed();