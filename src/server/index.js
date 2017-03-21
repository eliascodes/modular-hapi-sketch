'use strict';

const initServer = require('./server.js');

initServer((err, server) => {
  if (err) {
    throw err;
  }

  server.start((err) => {
    console.log('Server started');
    server.connections.forEach((conn) => console.log('Server listening on ', conn.info.uri));
  });
});
