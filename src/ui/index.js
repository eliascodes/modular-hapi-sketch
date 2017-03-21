'use strict';

const path = require('path');
const Handlebars = require('handlebars');

const viewConfigDefaults = {
  engines: { html: Handlebars },
  path: path.join(__dirname, 'views'),
  partialsPath: path.join(__dirname, 'views', 'partials'),
  layoutPath: path.join(__dirname, 'views', 'layouts'),
  layout: 'default',
};

exports.register = (server, options, next) => {
  // Hardcoded components, would be attached by discovery normally
  server.app.uiComponents = [
    require('../apps/orderForm'),
    require('../apps/billing')
  ];

  server.decorate('server', 'initialiseUi', () => {
    const components = values(server.app.uiComponents);

    const viewConfig = components
      .map((component) => component.views)
      .reduce((acc, viewConf) => mergeViewConfig(acc, viewConf), viewConfigDefaults);

    const routeConfig = components
      .map((component) => component.routes)
      .reduce((acc, r) => acc.concat(r), []);

    server.views(viewConfig);
    server.route(routeConfig);
  });

  server.route({
    method: 'GET',
    path: '/dash',
    handler: (request, reply) => reply.view('dashboard', { permissions: { billing: true } })
  });

  next();
};

exports.register.attributes = {
  name: 'UI Manager',
};



// UTILITY FUNCTIONS === IGNORE THIS
// pick path keys
// mergeWith on options with accumulator
// merge back into viewConfig
const pick = (keys) => (obj) => keys.reduce((acc, key) => {
  acc[key] = obj[key];
  return acc;
}, {});

const mergeWith = (fn) => (left, right) => {
  const m = Object.assign({}, left);
  Object.keys(right).forEach((key) => {
    if (left.hasOwnProperty(key)) {
      m[key] = fn(left[key], right[key]);
    } else {
      m[key] = right[key];
    }
  });
  return m;
};
const append = (a, b) => (Array.isArray(a) ? a : [].concat(a)).concat(b);

const pickViewDirectories = pick(['path', 'partialsPath', 'layoutPath']);
const mergeWithConcat = mergeWith(append);
const mergeViewConfig = (target, source) =>
  Object.assign(
    {},
    target,
    mergeWithConcat(pickViewDirectories(target), pickViewDirectories(source))
  );

const values = (o) => Object.keys(o).map((k) => o[k]);
