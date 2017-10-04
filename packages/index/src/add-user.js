import q from 'q';

export default function addUser({ wwsClient, email, space }) {
    console.log(`Adding user with email ${email} to space ${space}`);

    if (!isWhitelisted(email)) {
        throw new Error('user-not-whitelisted');
    }

    return q().then(() => {
        return wwsClient.ensureUserInvited({ email });
    }).then(user => {
        console.log(`Adding user with email ${email} and ID ${user.id} to space ${space}`);
        return wwsClient.addUserToSpace({
            userId: user.id,
            spaceId: space
        });
    }, err => {
        console.warn('Error adding user to space:', err);
        throw new Error('cannot-add-to-space');
    }).then(result => {
        if (!result) {
            throw new Error('Unexpected response when adding user to space: ' + result);
        }

        return { result };
    });
}

export function isWhitelisted(email) {
    if (/@ibm.com$/.exec(email)) {
        return true;
    }

    if (/@ibm.co.uk$/.exec(email)) {
        return true;
    }

    if (/@[a-zA-Z0-9]+\.ibm.com$/.exec(email)) {
        return true;
    }

    return false;
}
