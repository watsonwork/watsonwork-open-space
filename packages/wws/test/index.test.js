import { assert } from 'chai';
import nock from 'nock';

import WWS from '../src/index';

describe('WWS', function () {
    before(function () {
        nock.load(__dirname + '/replies.json');
    });

    // before(function () {
    //     nock.recorder.rec({
    //         dont_print: true,
    //         output_objects: true
    //     });
    // });
    //
    // after(function () {
    //     const replies = nock.recorder.play();
    //
    //     replies.forEach(reply => {
    //         let accessToken = reply.response.access_token;
    //
    //         if (typeof accessToken === 'string') {
    //             accessToken = `${accessToken.slice(0, 3)}...${accessToken.slice(-3)}`;
    //             reply.response.access_token = accessToken;
    //         }
    //
    //         reply.rawHeaders = reply.rawHeaders.filter((header, index) => {
    //             return header === 'Content-Type' || (index > 0 && reply.rawHeaders[index - 1] === 'Content-Type');
    //         });
    //     });
    //
    //     const json = JSON.stringify(replies, null, 4);
    //     console.log(json); // eslint-disable-line no-console
    // });

    describe('ensureToken', function () {
        before(function () {
            this.client = new WWS({
                id: process.env.APP_ID || 'test-id',
                secret: process.env.APP_SECRET || 'test-secret'
            });
        });

        it('should fetch a token given app credentials', function () {
            return this.client.ensureToken().then(() => {
                assert.isString(this.client.accessToken);
                this.firstToken = this.client.accessToken;
            });
        });

        it('should fetch a token even when a token already exists', function () {
            return this.client.ensureToken().then(() => {
                assert.isString(this.client.accessToken);
                assert.notEqual(this.firstToken, this.client.accessToken);
            });
        });
    });

    describe('fetchUser', function () {
        before(function () {
            this.client = new WWS({
                id: process.env.APP_ID || 'test-id',
                secret: process.env.APP_SECRET || 'test-secret'
            });
        });

        it('should fetch a user by email', function () {
            return this.client.fetchUser({ email: 'jgirata2@us.ibm.com' }).then(user => {
                assert.equal(user.displayName, 'John Girata');
            });
        });

        it('should fail gracefully when the user does not exist', function () {
            return this.client.fetchUser({ email: 'jgirata17@us.ibm.com' }).then(() => {
                throw new Error('Expected promise to be rejected, but it was resolved instead');
            }, err => {
                assert.equal('user-not-found', err.message);
            });
        });
    });
});
