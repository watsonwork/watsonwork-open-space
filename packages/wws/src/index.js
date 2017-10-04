import request from 'superagent';
import q from 'q';
import _ from 'lodash';

const TOKEN_ENDPOINT = 'https://api.watsonwork.ibm.com/oauth/token';

class WWS {
    constructor({ id, secret, personalRefreshToken, personalClientId, personalClientSecret }) {
        this.id = id;
        this.secret = secret;
        this.personalRefreshToken = personalRefreshToken;
        this.personalClientId = personalClientId;
        this.personalClientSecret = personalClientSecret;
    }

    ensureToken() {
        const req = request.post(TOKEN_ENDPOINT)
            .auth(this.id, this.secret)
            .type('form')
            .set('Accept-Encoding', '')
            .send({ grant_type: 'client_credentials' });

        return promisify(req).then(res => {
            this.accessToken = res.body.access_token;
            return this.accessToken;
        });
    }

    ensurePersonalToken() {
        const req = request.post(TOKEN_ENDPOINT)
            .auth(this.personalClientId, this.personalClientSecret)
            .type('form')
            .set('Accept-Encoding', '')
            .send({
                grant_type: 'refresh_token',
                refresh_token: this.personalRefreshToken
            });

        return promisify(req).then(res => {
            this.personalAccessToken = res.body.access_token;
            return this.personalAccessToken;
        });
    }

    fetchUser({ email }) {
        return this.ensureToken().then(() => {
            return execGraphQL({
                token: this.accessToken,
                query: `
                    query {
                        person(email: "${email}") {
                            email
                            id
                            displayName
                        }
                    }
                `
            });
        }).then(res => {
            const user = _.get(res, 'body.data.person');

            if (!user) {
                throw new Error('user-not-found');
            }

            return user;
        });
    }

    fetchSpace({ id }) {
        return this.ensureToken().then(() => {
            return execGraphQL({
                token: this.accessToken,
                query: `
                    query {
                        space(id: "${id}") {
                            id
                            title
                        }
                    }
                `
            });
        }).then(res => {
            const space = _.get(res, 'body.data.space');

            if (!space) {
                throw new Error('not-found');
            }

            return space;
        });
    }

    addUserToSpace({ userId, spaceId }) {
        return this.ensureToken().then(() => {
            return execGraphQL({
                token: this.accessToken,
                query: `
                    mutation {
                        updateSpace(input: {
                            id: "${spaceId}",
                            members: ["${userId}"],
                            memberOperation: ADD
                        }) {
                            memberIdsChanged
                        }
                    }
                `
            });
        }).then(res => {
            const changes = _.get(res, 'body.data.memberIdsChanged');

            if (changes) {
                return 'user-added';
            }

            return 'no-change';
        });
    }

    ensureUserInvited({ email }) {
        return this.ensurePersonalToken().then(accessToken => {
            const req = request.post('https://api.watsonwork.ibm.com/people/api/v1/people/invite/user')
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Accept-Encoding', '')
                .send({ email });

            return promisify(req);
        }).then(res => {
            const user = _.pick(res.body, 'email', 'extId');

            user.id = user.extId;

            return user;
        });
    }
}

function execGraphQL({ query, token }) {
    const req = request.post('https://api.watsonwork.ibm.com/graphql')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/graphql')
        .set('Accept-Encoding', '')
        .send(query.replace(/\s+/g, ' '));

    return promisify(req).then(res => {
        if (res.body && res.body.errors) {
            const err = new Error('Error executing GraphQL request');
            err.res = res;
            throw err;
        }

        return res;
    });
}

function promisify(req) {
    var deferred = q.defer();

    req.end((err, res) => {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(res);
        }
    });

    return deferred.promise;
}

export default WWS;
