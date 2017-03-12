'use strict';

module.exports = (config) =>
  [
    {
      method: 'GET',
      path: '/',
      handler: (request, reply) => reply.view('index')
    }, {
      method: 'GET',
      path: '/inspect',
      handler: (request, reply) => {
        reply(request.server);
      }
    }
  ];
