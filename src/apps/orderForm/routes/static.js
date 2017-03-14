'use strict';

const path = require('path');

module.exports = (config) => [
  {
    method: 'GET',
    path: `/static/${config.name}/{filename*}`,
    handler: {
      directory: {
        path: path.join(config.root, 'static'),
        index: false,
      }
    },
    config: { auth: false },
  }
]
