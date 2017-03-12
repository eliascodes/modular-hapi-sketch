'use strict';

const path = require('path');
const config = require('./config.js');
const views = require('./views');
const routes = require('./routes');

const app = module.exports = {};

const fakePlugin = {};
fakePlugin.register = (server, options, next) => {
  console.log('Registering');

  server.decorate('server', 'shout', () => {
    console.log('AAAAAAAAHHH');
  });

  next();
};

fakePlugin.register.attributes = {
  pkg: {name: 'lollololol'}
};


app.name = config.name;
app.path = __dirname;
app.connection = config.connection;

app.register = (server, options, next) => {
  // configure rendering engine
  server.views(views(config));

  // register routes
  server.route(routes(config));

  server.register(fakePlugin, (err) => {
    next(err);
  });
}

app.register.attributes = {
  pkg: { name: app.name }
};
