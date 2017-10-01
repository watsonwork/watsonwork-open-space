import { assert } from 'chai';

import WWS from '../src/index';

describe('WWS', function () {
    describe('ensureToken', function () {
        before(function () {
            this.client = new WWS({
                id: process.env.APP_ID,
                secret: process.env.APP_SECRET
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
                id: process.env.APP_ID,
                secret: process.env.APP_SECRET
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
