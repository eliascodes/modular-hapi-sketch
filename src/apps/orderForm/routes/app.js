'use strict';

module.exports = (config) =>
  [
    {
      method: 'GET',
      path: '/',
      handler: (request, reply) => reply.view('index')
    }
  ];
