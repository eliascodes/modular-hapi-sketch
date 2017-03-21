'use strict';

module.exports = (config) =>
  [
    {
      method: 'GET',
      path: '/',
      config: { auth: false },
      handler: (request, reply) => reply.view('index', {})
    }
  ];
