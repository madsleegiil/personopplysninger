require('dotenv').config();

const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const getDecorator = require('./src/build/decorator');
const createEnvSettingsFile = require('./src/build/env');

const server = express();

server.set('views', `${__dirname}/build`);
server.set('view engine', 'mustache');
server.engine('html', mustacheExpress());

server.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  next();
});

const renderApp = decoratorFragments =>
  new Promise((resolve, reject) => {
    server.render('index.html', decoratorFragments, (err, html) => {
      if (err) {
        reject(err);
      } else {
        resolve(html);
      }
    });
  });

const startServer = (html) => {
  // can be used for testing purposes
  // const delayAllResponses = millis => (req, res, next) => setTimeout(next, millis);
  // server.use(delayAllResponses(1000));

  server.use('/personopplysninger/mock-api', express.static(path.resolve(__dirname, 'src/mock-api')));
  server.use('/personopplysninger/static/js', express.static(path.resolve(__dirname, 'build/static/js')));
  server.get('/personopplysninger/static/js/settings.js', (req, res) => res.send(createEnvSettingsFile()));

  server.use(
    '/personopplysninger/static/css',
    express.static(path.resolve(__dirname, 'build/static/css')),
  );

  server.use(
    '/personopplysninger/static/fonts',
    express.static(path.resolve(__dirname, 'build/static/fonts')),
  );

  server.use(
    '/personopplysninger/static/media',
    express.static(path.resolve(__dirname, 'build/static/media')),
  );

  server.get('/personopplysninger/health/isAlive', (req, res) => res.sendStatus(200));
  server.get('/personopplysninger/health/isReady', (req, res) => res.sendStatus(200));

  server.get(/^\/(?!.*static).*$/, (req, res) => {
    res.send(html);
  });

  const port = process.env.PORT || 8080;
  server.listen(port, () => {
    console.log(`App listening on port: ${port}`); // eslint-disable-line
  });
};

const logError = (errorMessage, details) => console.log(errorMessage, details); // eslint-disable-line

getDecorator()
  .then(renderApp, error => logError('Failed to get decorator', error))
  .then(startServer, error => logError('Failed to render app', error));
