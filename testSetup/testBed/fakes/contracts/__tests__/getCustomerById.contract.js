import client from '../../../../../services/externalService/client';
import fixtures from '../../../../fixtures/externalService';
import { CUSTOMER_ID, verifySuccessResponseStructure, verifyData } from '../externalServiceTestData';

describe('getCustomerById', () => {
    it('should return expected structure with status 200', done => {
        client.get(`/getCustomerById?id=${CUSTOMER_ID}`, (error, response) => {
            expect(error).toBeNull();
            verifySuccessResponseStructure(response);

            const [consumerCustomer] = fixtures.customers;
            const providerCustomer = response.body.data;

            expect(typeof consumerCustomer.id).toEqual(typeof providerCustomer.id);
            verifyData(consumerCustomer.data, providerCustomer.data);

            done();
        });
    });
});
