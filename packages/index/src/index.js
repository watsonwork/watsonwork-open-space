import express from 'express';
import handlebars from 'express-handlebars';
import bodyParser from 'body-parser';
import path from 'path';

import WWSClient from 'ww-open-space-wws';

import cfenv from 'cfenv';

const appEnv = cfenv.getAppEnv();
const creds = appEnv.getServiceCreds(/ww-open-space-creds/) || {};

export const app = express();
app.use(bodyParser.json());

app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');

const viewPath = require.resolve('ww-open-space-static');

const wwsClient = new WWSClient({
    id: getEnvValue('APP_ID'),
    secret: getEnvValue('APP_SECRET'),
    personalRefreshToken: getEnvValue('PERSONAL_REFRESH_TOKEN'),
    personalClientId: getEnvValue('PERSONAL_CLIENT_ID'),
    personalClientSecret: getEnvValue('PERSONAL_CLIENT_SECRET')
});

function getEnvValue(key) {
    return creds[key] || process.env[key];
}

app.get('/', (req, res) => {
    res.sendStatus(200);
});

app.post('/api/join', (req, res) => {
    res.sendStatus(200);
    return;
});

app.use('/static', express.static(path.dirname(viewPath)));

app.get(/\/static\/.*/, (req, res) => { // If there is no matching file in the static directory
    res.status(404).send();
});

app.get('/join/:spaceId', (req, res) => {
    const id = req.params.spaceId;

    wwsClient.fetchSpace({ id }).then(space => {
        const args = {
            space,
            staticBase: '/static/',
            layout: false
        };

        res.render(viewPath, args);
    }).catch(err => {
        console.error('Error fetching space', id, err);
        res.sendStatus(404);
    });
});

const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log('Server listening on port', PORT);
    });
}
