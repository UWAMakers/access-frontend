// src/store/services/users.js
import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client';

class Induction extends BaseModel {
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'NotificationTemplates';

  // Define default properties here
  static instanceDefaults() {
    return {
      subject: 'A new notification',
      body: '## Hello world!',
      action: 'template_example',
      description: '',
      buttonText: '',
      buttonLink: '',
      to: [],
      cc: [],
      bcc: [],
      trainingId: null,
      sendToUser: false,
      daysOfWeek: [],
      hoursOfDay: [],
      enabled: false,
    };
  }
}

const servicePath = 'notification-templates';
const servicePlugin = makeServicePlugin({
  Model: Induction,
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
