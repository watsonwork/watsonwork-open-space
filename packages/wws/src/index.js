import request from 'superagent';
import q from 'q';
import _ from 'lodash';

class WWS {
    constructor({ id, secret }) {
        this.id = id;
        this.secret = secret;
    }

    ensureToken() {
        const req = request.post('https://api.watsonwork.ibm.com/oauth/token')
            .auth(this.id, this.secret)
            .type('form')
            .set('Accept-Encoding', '')
            .send({ grant_type: 'client_credentials' });

        return promisify(req).then(res => {
            this.accessToken = res.body.access_token;
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
