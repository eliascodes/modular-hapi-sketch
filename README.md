# Structural Breakdown of a Modular Hapi Web Service

**This is a work in progress!**

## Requirements
* Allows teams to work in parallel on different functional areas of the app without stepping on each others toes
* Decoupled enough to allow changes in implementation of specific modules without significantly affecting the rest of the service
* Decoupled enough to allow moving certain functional areas to different servers.

## High Level
A broad breakdown of the service into 4 different hierarchical areas

1. [Basic infrastructure](#basic-infrastructure)
2. [Common components](#common-components)
3. [Functional components](#functional-components)
4. [Applications](#applications)

### Basic Infrastructure
This covers provision of the basic network infrastructure, such as:
* a web server listening on one or more ports
* any potential web socket server
* configuration files for these services

### Common Components
This covers bits of functionality that will be widely used across the rest of the service, such as:
* Utility methods
* Database abstraction
* Cache abstraction
* config files
* constants
These are not necessarily independent of each other (e.g. cache might rely on DB), but are independent of functional components and apps.

### Functional Components
Configuration of functional components should happen during run-time by dependent code, rather than being specified in a static file.
* PABX API
* PABX Broker
* User management
* Session management
* Billing component
* ...

### Applications
Each application will be self-contained, contain:
* Server-side routing
* Authentication rules
* Request validation rules
* Views
* Constants
* Client-side JS
* Styling
* App-specific tests
* Config files

## Directory structure
```
./
|- docs                                : Detailed project documentation
|- scripts                             : Scripts for deployment, dev-ops style stuff
|- src                                 : Codebase
|- |- apps                             : Client-facing applications
|- |- |- MyFirstApp (server rendered)  : Specific code for MyFirstApp
|- |- |- |- api                        : Routes defining the app's HTTP API (if any)
|- |- |- |- auth                       : Configures the auth strategies for app
|- |- |- |- routes                     : Routes for static assets, views & auth
|- |- |- |- session                    : Configures the session mgmt strategy/ies
|- |- |- |- static                     : Static assets
|- |- |- |- views                      : HTML and/or templates
|- |- |- |- ...                        : Other app-specific components
|- |- |- |- index.js                   : App entry point should provide Hapi plugin interface
|- |- |- |- config.js                  : App-specific configuration
|- |- |- |- ...dotfiles
|- |- |- MySecondApp (single page app) : Specific code for MySecondApp
|- |- |- |- api                        : Routes defining the app's HTTP API
|- |- |- |- auth                       : Configures the auth strategies for app
|- |- |- |- client                     : Client-side app (React/Angular/Ember/etc)
|- |- |- |- dist                       : Built assets for distribution (e.g. transpiled JS)
|- |- |- |- routes                     : Routes for static assets, views & auth
|- |- |- |- scss                       : If using SASS
|- |- |- |- session                    : Configures the session mgmt strategy/ies
|- |- |- |- static                     : Static assets
|- |- |- |- ...
|- |- |- |- index.js                   : App entry point should provide Hapi plugin interface
|- |- |- |- config.js                  : App-specific configuration
|- |- |- |- ...dotfiles
|- |- broker                           : Manages guest credential pools & room creation
|- |- cache                            : Cache abstraction(s)
|- |- db                               : Database abstraction(s)
|- |- models                           : Commonly used model objects
|- |- pabx                             : PABX API methods / interface
|- |- server                           : Basic server infrastructure
|- |- session                          : Session management abstraction(s)
|- |- user                             : User management
|- .env
|- ...dotfiles
|- package.json                        : One top level package.json, since this is still a monolith
|- README.md
```

## Notes
* Each client-facing app should be delivered over its own connection. Can implement a reverse-proxy with e.g. NGINX to direct namespaced requests to the right connection.
* All common components should decorate the server, request and/or reply objects
  * This means, e.g. being able to access the cache API via `request.cache` in handlers
  * This allows application-level code to access these components without requiring them in (decouples the apps from the directory structure)
* Each application can provide its own db/cache abstractions if, for example, only one app needs a redis connection.
* Common components may want to provide segregated access to their services.
  * This means the interactions of an application with a common component would not affect the interactions of a different application with the same component
  * Concretely, for example, the cache should be segregated by app. One app should not have access to the cache of another app. A counter-example would be some DB models, which presumably would need to be shared across apps.

## Dependencies
Dependencies marked [Hapi] are authored and maintained by the Hapi.js team.

### Required
* `hapi` -- [Hapi] Web framework
* `glue` -- [Hapi] server composition logic
* `inert` -- [Hapi] static file logic
* `vision` -- [Hapi] template rendering logic
* `env2` -- Simple environment variable management

### Recommended
* `boom` -- [Hapi] HTTP-friendly error objects
* `joi` -- [Hapi] Simple data validation library
* `wreck` -- [Hapi] HTTP client utilities

## Design
### General
Common components should prefer to provide relatively granular and composable APIs. This allows functional components to define their API and behaviour in terms of compositions of common component operations.

### DB
Should be flexible enough to support multiple DB servers and types. At its simplest, could just be a container. For example
```js
server.app.db = new DatabaseMgr();

server.app.db.add('postgres_main', 'psql://username@password:hostname:port');
server.app.db.add('redis_cache', 'redis://username@password:hostname:port');

const pg = server.app.db.get('postgres_main');

// use the pg methods directly
pg.query('SELECT * FROM foo')
  .then(/* do stuff */);

// use shortcut methods
// these could be custom written or provided by a DB library like `knex`
pg.select('*').from('foo').where({ this: 'that' })
  .then(/* do stuff */);
```

### Models
Model objects should rely on the DB API to provide a higher level API to functional components. Models that are commonly used can be defined in a top-level `models` directory. Those specific to functional areas should be defined in that components directory. If the project decides to use a DB library that can also serve as an ORM, these model objects may simply need to provide a facade to the methods of this ORM. For example
```js
const User = require('./user.js');

server.app.models = {};
server.app.models.User = User;

User.bind(server.app.db.get('postgres_user')); // bind DB connection?

User.findOne('column_name', 'column_value') // static utility methods to build models from DB
  .then((user) => { // resolves with a JS object that can be interacted with in-memory ...
    /* do stuff */
    return user.save(); // ... and then saved back to the DB
    // User.save(user); might make more sense?
  })
  .then((user) => {
    user.authenticate('somesaltedhash') // might integrate auth methods into the model
      .then((isValid) => {
        if (isValid) {
          return callback(null, user);
        } else {
          return callback(new Error('Invalid credentials'))
        }
      });
  });

// create a new user in the DB
User.create(userConfig)
  .then((user) => reply(user.toJSON()))
  .catch((err) => console.log('Unable to create user'))
```
#### Notes
In more standard ORMs, any in-memory JS objects used to represent table rows are short-lived. The longer these objects live the more data consistency is an issue. This could be addressed by implementing pub/sub to update the JS objects, but this will only work for DBs that have this feature (e.g. Redis, Postgres, etc?).
