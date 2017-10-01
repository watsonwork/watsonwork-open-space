import { assert } from 'chai';
import nock from 'nock';

import WWS from '../src/index';

describe('WWS', function () {
    before(function () {
        this.client = new WWS({
            id: process.env.APP_ID || 'test-id',
            secret: process.env.APP_SECRET || 'test-secret'
        });
    });

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

    describe('fetchSpace', function () {
        it('should fetch a space by ID', function () {
            return this.client.fetchSpace({ id: '59d14041e4b0580885399ed7' }).then(space => {
                assert.equal('Open Space Test', space.title);
            });
        });

        it('should fail gracefully when the space does not exist', function () {
            return this.client.fetchSpace({ id: '17' }).then(() => {
                throw new Error('Expected promise to be rejected, but it was resolved instead');
            }, err => {
                assert.equal('not-found', err.message);
            });
        });
    });

    describe('addUserToSpace', function () {
        it('add a user to a space', function () {
            return this.client.addUserToSpace({
                userId: 'fba49b40-5182-1032-9393-89fbb6fdad64',
                spaceId: '59d14041e4b0580885399ed7'
            }).then(result => {
                assert.equal('no-change', result);
            });
        });

        it('should fail gracefully when the app does not have access to the space', function () {
            return this.client.addUserToSpace({
                userId: 'fba49b40-5182-1032-9393-89fbb6fdad64',
                spaceId: '17'
            }).then(() => {
                throw new Error('Expected promise to be rejected, but it was resolved instead');
            }, err => {
                assert.equal('Error executing GraphQL request', err.message);
            });
        });

        it('should fail gracefully when the user does not exist', function () {
            return this.client.addUserToSpace({
                userId: '17',
                spaceId: '59d14041e4b0580885399ed7'
            }).then(result => {
                assert.equal('no-change', result);
            });
        });
    });
});
