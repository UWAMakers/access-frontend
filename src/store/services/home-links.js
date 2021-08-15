// src/store/services/users.js
import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client';

class HomeLink extends BaseModel {
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'HomeLink'

  // Define default properties here
  static instanceDefaults() {
    return {};
  }
}
const servicePath = 'home-links';
const servicePlugin = makeServicePlugin({
  Model: HomeLink,
  service: feathersClient.service(servicePath),
  servicePath,
});

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
});

export default servicePlugin;
