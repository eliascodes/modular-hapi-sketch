'use strict';

const Glue = require('glue');
const config = require('./config.js');
const manifest = require('./server.js');

process.on('uncaughtException', (err) => console.log(err));
process.on('unhandledRejection', (err) => console.log(err));

Glue.compose(manifest, (err, server) => {
  if (err) {
    throw err;
  }

  server.start((err) => {
    console.log('Server started');
    server.connections.forEach((conn) => {
      console.log('Server listening on ', conn.info.uri);
    })
  })
});
