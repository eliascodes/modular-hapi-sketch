'use strict';

require('env2')('.env');
const path = require('path');

const defaultConfig = {
  server: {},
  root: path.resolve(__dirname, '..'),
};

const configs = {
  test: () => Object.assign({}, defaultConfig, {}),
  prod: () => Object.assign({}, defaultConfig, {}),
  dev: () => Object.assign({}, defaultConfig, {}),
}

module.exports = configs[process.env.NODE_ENV || 'dev']();
