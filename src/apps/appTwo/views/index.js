'use strict';

const path = require('path');
const Handlebars = require('handlebars');

module.exports = (config) => ({
  engines: { html: Handlebars },
  path: path.join(config.root, 'views', 'templates'),
  layout: 'default',
  layoutPath: path.join(config.root, 'views', 'templates', 'layout'),
});
