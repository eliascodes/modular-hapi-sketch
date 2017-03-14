'use strict';

module.exports = (config) =>
  [
    {
      method: 'GET',
      path: '/two',
      handler: {
        view: {
          template: 'index',
          context: { stuff: 'Created by view handler object' },
          options: { layout: 'appTwoLayout' },
        }
      }
    }
  ];
