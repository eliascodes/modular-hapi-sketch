'use strict';

const path = require('path');
const config = require('./config.js');
const views = require('./views');
const routes = require('./routes');

const app = module.exports = {};

app.name = config.name;
app.path = __dirname;
app.connection = config.connection;

app.register = (server, options, next) => {
  // configure rendering engine
  server.views(views(config));

  // register routes
  server.route(routes(config));

  next();
}

app.register.attributes = {
  pkg: { name: app.name }
};
