// src/store/services/users.js
import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client';

const fix = (name = '') => name.trim().replace(/\s+\(\d+\)$/, '');

class User extends BaseModel {
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'User'

  // eslint-disable-next-line no-unused-vars
  static setupInstance(data, { store, models }) {
    return {
      ...data,
      name: !data.displayName || fix(data.displayName) === fix(data.firstName)
        ? `${fix(data.firstName)} ${data.lastName}`
        : fix(data.displayName),
    };
  }

  static instanceDefaults() {
    return {
      preferences: { dark: false },
      roles: [],
    };
  }
}
const servicePath = 'users';
const servicePlugin = makeServicePlugin({
  Model: User,
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
