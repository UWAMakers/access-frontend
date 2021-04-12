import Vue from 'vue';
import Vuex from 'vuex';
import { FeathersVuex } from '../feathers-client';
import auth from './store.auth';

Vue.use(Vuex);
Vue.use(FeathersVuex);

const requireModule = require.context(
  // The path where the service modules live
  './services',
  // Whether to look in subfolders
  false,
  // Only include .js files (prevents duplicate imports`)
  /\.js$/,
);
const servicePlugins = requireModule
  .keys()
  .map((modulePath) => requireModule(modulePath).default);

export default new Vuex.Store({
  state: {
    snackbar: {
      visible: false,
      text: '',
      timeout: 6000,
      severity: 'info',
    },
  },
  mutations: {
    showSnackbar(state, payload) {
      state.snackbar = {
        ...state.snackbar,
        ...payload,
      };
    },
    closeSnackbar(state) {
      state.snackbar = {
        ...state.snackbar,
        visible: false,
        timeout: 6000,
        text: '',
        severity: 'info',
      };
    },
  },
  getters: {
    snackbar(state) {
      return state.snackbar;
    },
  },
  actions: {},
  plugins: [...servicePlugins, auth],
});
