'use strict';

const path = require('path');
const Handlebars = require('handlebars');

module.exports = (config) => ({
  engines: { html: Handlebars },
  path: [
    path.join(config.projectRoot, 'views'),
    path.join(config.root, 'views', 'templates')
  ],
  partialsPath: [
    path.join(config.projectRoot, 'views', 'partials'),
    path.join(config.root, 'views', 'templates', 'partials')
  ],
  partialsPath: [
    path.join(config.projectRoot, 'views', 'partials'),
    path.join(config.root, 'views', 'templates', 'partials')
  ],
  layout: 'default',
  layoutPath: [
    path.join(config.projectRoot, 'views', 'layout'),
    path.join(config.root, 'views', 'templates', 'layout')
  ],
});
