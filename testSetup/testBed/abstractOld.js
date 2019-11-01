import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import createParametersContainer from '../../middlewares/common/createParametersContainer';
import mainRoute from '../../routes/index';
import basicErrorHandler from '../../middlewares/errorHandler/basicErrorHandler';

class AbstractTestBed {
    constructor() {
        const app = express();

        app.use(cookieParser());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(createParametersContainer);
        app.use('/', mainRoute);
        app.use(basicErrorHandler);

        this.sut = request(app);
        this.dummies = {
            userDummy: {
                id: 1,
                firstName: 'Jhon',
                lastName: 'Doe'
            },
            tokenDummy: {
                userID: 1,
                expiresAt: new Date(new Date().getTime() + 10000),
                isValid: true
            }
        };
        this.expectations = {
            externalServiceURL: 'https://demo.service.de/rest:client',
            tokenQuery: 'SELECT * FROM authenticationToken WHERE token=?',
            userQuery: 'SELECT * FROM user WHERE id=?'
        };
    }

    getSUT() {
        return this.sut;
    }
}

export default TestBedAbstract;













