import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client';

class Training extends BaseModel {
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Training'

  // eslint-disable-next-line no-unused-vars
  static setupInstance(data, { store, models }) {
    return {
      ...data,
    };
  }

  static instanceDefaults() {
    return {
      itemIds: [],
    };
  }
}
const servicePath = 'trainings';
const servicePlugin = makeServicePlugin({
  Model: Training,
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
