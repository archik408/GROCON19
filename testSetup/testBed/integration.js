import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import request from 'supertest';
import TestBedAbstract from './abstract';
import fakeExternalService from './fakes/fakeExternalService';
import createParametersContainer from '../../middlewares/common/createParametersContainer';
import mainRoute from '../../routes';
import basicErrorHandler from '../../middlewares/errorHandler/basicErrorHandler';

jest.mock('../../assets/logger');

class TestBed extends TestBedAbstract {
    constructor() {
        super();

        const app = express();

        app.use(cookieParser());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(createParametersContainer);
        app.use('/', mainRoute);
        app.use(basicErrorHandler);

        this.sut = request(app);
    }

    getSUT() {
        return this.sut;
    }

    loadInitialData() {
        fakeExternalService();
        return global.__KNEX__.seed.run();
    }
}

export default new TestBed();
