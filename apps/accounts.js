const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const config = require('./config');

const app = express();

app.use(require('morgan')('dev'));
app.use(express.static(__dirname + '/../dist'));
app.use('/bower_components', express.static(__dirname + '/../bower_components'));

// parse application/json
app.use(bodyParser.json());
if (config.livereload) app.use(require('connect-livereload')());

app.post('/api/login', function login(req, res) {
  const options = {
    url: `${config.OAUTH_SERVER}${config.OAUTH_ENDPOINT}`,
    auth: {
      user: config.OAUTH_CLIENT,
      pass: config.OAUTH_SECRET,
    },
    form: {
      grant_type: 'password',
      username: req.body.username,
      password: req.body.password,
    },
  };

  request.post(options, function handleRes(err, apires, body) {
    if (err) return res.status(500).send(err);
    return res.status(apires.statusCode).send(body);
  });
});

app.post('/api/refresh', function login(req, res) {
  const options = {
    url: `${config.OAUTH_SERVER}${config.OAUTH_ENDPOINT}`,
    auth: {
      user: config.OAUTH_CLIENT,
      pass: config.OAUTH_SECRET,
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: req.body.refresh_token,
    },
  };

  request.post(options, function handleRes(err, apires, body) {
    if (err) return res.status(500).send(err);
    return res.status(apires.statusCode).send(body);
  });
});

app.post('/api/logout', function login(req, res) {
  const options = {
    url: `${config.OAUTH_SERVER}${config.OAUTH_ENDPOINT}/${req.body.access_token}`,
    auth: {
      user: config.OAUTH_CLIENT,
      pass: config.OAUTH_SECRET,
    },
  };

  request.del(options, function handleRes(err, apires, body) {
    if (err) return res.status(500).send(err);
    return res.status(apires.statusCode).send(body);
  });
});

app.post('/api/forgotpass', function login(req, res) {
  const options = {
    url: `${config.OAUTH_SERVER}/users/forgotPassword`,
    json: true,
    auth: {
      user: config.OAUTH_CLIENT,
      pass: config.OAUTH_SECRET,
    },
    body: {
      grant_type: req.body.username,
    },
  };

  request.post(options, function handleRes(err, apires, body) {
    if (err) return res.status(500).json(err);
    return res.status(apires.statusCode).json(body);
  });
});

app.get('/*', function serveApp(req, res) {
  res.sendFile('accounts.html', { root: __dirname + '/../dist/html' });
});

module.exports = app;