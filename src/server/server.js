'use strict';

const path = require('path');
const config = require('./config.js');

const apps = [
  config.root + '/apps/appOne',
  config.root + '/apps/appTwo',
].map((s) => ({ plugin: s }));

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
  connections: [{ port: 8080 }],
  registrations: globalPlugins.concat(apps)
}
