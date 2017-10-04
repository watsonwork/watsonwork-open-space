// import { assert } from 'chai';
import request from 'supertest';

import { app } from '../src/index';

describe('Open space service', function () {
    it('should return the static JS file', function () {
        return request(app)
            .get('/static/script.js')
            .expect(200);
    });
});
