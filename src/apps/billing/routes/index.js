'use strict';

module.exports = (config) =>
  [
    './app.js',
    './static.js',
  ]
    .map(require)
    .map((fn) => fn(config))
    .reduce((acc, l) => acc.concat(l), []); // flatten
