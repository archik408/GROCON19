import fs from 'fs';
import path from 'path';
import needle from 'needle';
import fixtures from '../../fixtures/externalService';
import config from '../../../config/configGlobal';
import successResponse from './contracts/successResponse';
import failureResponse from './contracts/failureResponse';

const {
    EXTERNAL_SERVICE_SETTINGS: { URL, API_HASH, API_AUTHORIZATION }
} = config;

export default function fakeExternalService() {
    const expectedServiceURL = `${URL}/rest:client/${API_HASH}`;
    const expectedHeaders = {
        Authorization: `Basic ${API_AUTHORIZATION}`
    };

    needle.get = jest.fn().mockImplementation((url, options, callback) => {
        expect(callback).toEqual(expect.any(Function));
        expect(options).toEqual({ headers: expectedHeaders });
        expect(url).toContain(expectedServiceURL);

        const [operation, params] = url.replace(expectedServiceURL, '').split('?');
        const valueOf = getURLParamValue.bind(this, params);

        switch (operation) {
            case '/getCustomerById': {
                successResponse.body.data = fixtures.customers.find(c => c.id == valueOf('id'));
                callback(null, successResponse, successResponse.body);
                break;
            }
            /*
            * Other end-points
            */
            default: {
                callback(null, failureResponse, failureResponse.body);
            }
        }
    });

    needle.post = jest.fn().mockImplementation((url, data, options, callback) => {
        /* POST Implementation  */
    });
}

function getURLParamValue(params, name) {
    return params.split('&').reduce((map, pair) => {
        const [key, value] = pair.split('=');
        map[key] = value;
        return map;
    }, {})[name];
}
