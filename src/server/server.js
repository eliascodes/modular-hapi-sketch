'use strict';

const path = require('path');
const Glue = require('glue');
const config = require('./config.js');

// 1. Register all low-level components
// 2. Setup config manager
// 3. Service discovery
// 4. Service initialisation
//

const apps = [
  config.root + '/ui',
].map((s) => ({ plugin: s }));

const globalPlugins = [
  { plugin: 'inert' },
  { plugin: 'vision' },
  // { plugin: '../db' },
  // { plugin: '../cache' },
  // { plugin: '../pabx' },
  // { plugin: '../broker' },
];

const manifest = {
  server: config.server,
  connections: [{ port: 8080 }],
  registrations: globalPlugins.concat(apps)
};

module.exports = (cb) => {
  Glue.compose(manifest, (err, server) => {
    if (err) {
      return cb(err);
    }

    server.initialiseUi();

    cb(null, server);
  });
};
