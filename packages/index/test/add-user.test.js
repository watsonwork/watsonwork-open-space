import { assert } from 'chai';
import sinon from 'sinon';
import q from 'q';

import addUser, { isWhitelisted } from '../src/add-user';

describe('checkWhitelist', function () {
    function testEmail(email, expected) {
        assert.equal(isWhitelisted(email), expected, email);
    }

    it('should reject non-IBM emails', function () {
        testEmail('foo@yopmail.com', false);
    });

    it('should allow @ibm.com emails', function () {
        testEmail('john@ibm.com', true);
    });

    it('should allow @*.ibm.com emails', function () {
        testEmail('john@us.ibm.com', true);
        testEmail('john@ie.ibm.com', true);
        testEmail('john@mx2.ibm.com', true);
    });

    it('should allow @ibm.co.uk emails', function () {
        testEmail('john@ibm.co.uk', true);
    });
});

describe('addUser', function () {
    beforeEach(function () {
        this.wwsClient = {
            ensureUserInvited: sinon.stub(),
            addUserToSpace: sinon.stub()
        };
    });

    it('it add users with an IBM email', function () {
        this.wwsClient.ensureUserInvited.withArgs({
            email: 'john@ibm.com'
        }).returns(q({
            email: 'john@ibm.com',
            id: '17'
        }));

        this.wwsClient.addUserToSpace.withArgs({
            userId: '17',
            spaceId: '18'
        }).returns({
            result: 'user-added'
        });

        addUser({
            wwsClient: this.wwsClient,
            email: 'john@ibm.com',
            space: '18'
        }).then(status => {
            assert.equal(status.result, 'user-added');
        });
    });

    it('does not add users with non-IBM emails', function () {
        assert.throws(() => {
            addUser({ email: 'john@foo.com' });
        }, 'user-not-whitelisted');
    });
});
