'use strict';

const ConfigManager = require('./manager.js');
const config = require('./index.js');

exports.register = (server, options, next) => {
  const mgr = server.app.confMgr = new ConfigManager(config);

  mgr.discover(config.componentsDir, { target: 'plugin.js' })
    .then((componentPlugins) => server.register(componentPlugins))
    .then(() => mgr.discover(config.appsDir, { target: 'plugin.js', compatible: true }))
    .then((appPlugins) => server.register(appPlugins))
    .then(() => next())
    .catch((err) => next(err));
};

exports.register.attributes = { name: 'Config Manager' };
