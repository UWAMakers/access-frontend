// src/store/services/users.js
import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client';

class InductionPending extends BaseModel {
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'InductionPending'

  // Define default properties here
  static instanceDefaults() {
    return {
      msg: '',
    };
  }
}
const servicePath = 'inductions-pending';
const servicePlugin = makeServicePlugin({
  Model: InductionPending,
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
