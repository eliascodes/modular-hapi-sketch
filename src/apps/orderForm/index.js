'use strict';

const path = require('path');
const roles = require('../../constants/roles.js');

const app = module.exports = {};

app.permissions = [ roles.USER, roles.ADMIN ];
app.components = [ 'ui', 'email', 'session', 'user' ];

app.config = require('./config.js');
app.routes = require('./routes')(app.config);
app.views = {
  path: path.join(app.config.root, 'views'),
  partialsPath: path.join(app.config.root, 'views', 'partials'),
  layoutPath: path.join(app.config.root, 'views', 'layout'),
};
