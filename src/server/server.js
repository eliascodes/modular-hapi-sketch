'use strict';

const path = require('path');
const config = require('./config.js');

const apps = [
  '../apps/appOne',
  '../apps/appTwo',
].map(require);

const connections = apps.map((app) => app.connection);
const appPlugins = apps.map((app) => ({
  plugin: app.path,
  options: { select: app.connection.labels }
}));

const globalPlugins = [
  { plugin: 'inert' },
  { plugin: 'vision' },
  // { plugin: '../db' },
  // { plugin: '../cache' },
  // { plugin: '../pabx' },
  // { plugin: '../broker' },
];

module.exports = {
  server: config.server,
  connections,
  registrations: globalPlugins.concat(appPlugins)
}
