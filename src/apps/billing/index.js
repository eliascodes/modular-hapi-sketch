'use strict';

const path = require('path');
const config = require('./config.js');
const views = require('./views');
const routes = require('./routes');

const app = module.exports = {};

app.name = config.name;

app.register = (server, options, next) => {
  // configure rendering engine
  server.views(views(config));

  // register routes
  server.route(routes(config));

  next();
}

app.register.attributes = {
  name: app.name,
  // will wait until 'db' plugin is registered before registering this plugin.
  // in current example, no 'db' plugin is registered, so registration will fail,
  // and server will stop running
  // dependencies: 'db',
};
