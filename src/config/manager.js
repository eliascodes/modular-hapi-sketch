'use strict';

class ConfigurationManager {
  constructor () {
    this._components = {};
    this._apps = {};
  }

  // getters?
  components (query) {}
  apps (query) {}

  discover (dirs, cb) {
    // Hardcoded for the moment
    const components = [
      '../components/broker',
      '../components/email',
      '../components/session',
      '../components/user',
      '../components/ui',
    ].map((p) => p + '/plugin.js').map(require);


  }
}
