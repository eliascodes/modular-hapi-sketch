'use strict';

require('env2')('.env');

const defaultConfig = {
  server: {}
};

const configs = {
  test: () => Object.assign({}, defaultConfig, {}),
  prod: () => Object.assign({}, defaultConfig, {}),
  dev: () => Object.assign({}, defaultConfig, {}),
}

module.exports = configs[process.env.NODE_ENV || 'dev']();
