import { assert } from 'chai';
import nock from 'nock';

import WWS from '../src/index';

const config = {
    envValues: {
        id: process.env.APP_ID,
        secret: process.env.APP_SECRET
    },
    defaultValues: {
        id: 'test-id',
        secret: 'test-secret'
    }
};

describe('WWS', function () {
    const record = process.env.RECORD === 'true';

    before(function () {
        this.client = new WWS(record ? config.envValues : config.defaultValues);
    });

    before(function () {
        if (!record) {
            nock.load(__dirname + '/replies.json');
        }
    });

    before(function () {
        if (record) {
            nock.recorder.rec({
                dont_print: true,
                output_objects: true
            });
        }
    });

    after(function () {
        if (record) {
            const replies = nock.recorder.play();

            replies.forEach(reply => {
                sanitizeToken(reply.response, 'access_token');
                sanitizeToken(reply.response, 'refresh_token');

                reply.rawHeaders = reply.rawHeaders.filter((header, index) => {
                    return header === 'Content-Type' || (index > 0 && reply.rawHeaders[index - 1] === 'Content-Type');
                });
            });

            let json = JSON.stringify(replies, null, 4);

            Object.keys(config.envValues).forEach(key => {
                json = json.replace(new RegExp(config.envValues[key], 'g'), config.defaultValues[key]);
            });

            console.log(json); // eslint-disable-line no-console
        }
    });

    function sanitizeToken(obj, tokenKey) {
        let token = obj[tokenKey];

        if (typeof token === 'string') {
            token = `${token.slice(0, 3)}...${token.slice(-3)}`;
            obj[tokenKey] = token;
        }
    }

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

    describe('inviteUser', function () {
        it('should successfuly invite new users with valid emails', function () {
            return this.client.ensureUserInvited({
                email: 'ww-open-space-test-1507152436874@yopmail.com'
            }).then(user => {
                assert.isString(user.id);
            });
        });

        it('should return existing users if the email is already registered', function () {
            return this.client.ensureUserInvited({
                email: 'jgirata2@us.ibm.com'
            }).then(user => {
                assert.equal('fba49b40-5182-1032-9393-89fbb6fdad64', user.id);
            });
        });
    });
});
