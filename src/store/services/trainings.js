import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client';

class Training extends BaseModel {
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Training'

  // eslint-disable-next-line no-unused-vars
  static setupInstance(data, { store, models }) {
    return {
      ...data,
      isLocked(user) {
        if (!this.parentIds?.length) return false;
        const { total } = models.api.Completion.findInStore({
          query: {
            trainingId: { $in: this.parentIds },
            userId: (user || store.getters['auth/user'])?._id,
            status: 'complete',
            $limit: 0,
          },
        });
        return total !== this.parentIds.length;
      },
      completion(user) {
        const { data: comps } = models.api.Completion.findInStore({
          query: {
            trainingId: this._id,
            userId: (user || store.getters['auth/user'])?._id,
          },
        });
        return comps[0];
      },
      status(user) {
        const currentUser = !user || user._id === store.getters['auth/user']?._id;
        if (this.isLocked(user)) return { text: `Locked (${!currentUser ? 'They' : 'You'} must complete other training first)`, icon: 'mdi-lock-outline' };
        if (this.completion?.(user)?.status === 'complete') return { text: 'Completed', color: 'success', icon: 'mdi-check-circle-outline' };
        return { text: 'Pending Completion', color: 'warning', icon: 'mdi-minus-circle-outline' };
      },
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
