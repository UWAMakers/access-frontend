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

const defaultSnack = () => ({
  visible: false,
  text: '',
  timeout: 6000,
  severity: 'info',
  errorReport: null,
});

export default new Vuex.Store({
  state: {
    snackbar: defaultSnack(),
  },
  mutations: {
    showSnackbar(state, payload) {
      state.snackbar = {
        ...defaultSnack(),
        visible: true,
        ...payload,
      };
    },
    closeSnackbar(state) {
      state.snackbar = {
        ...state.snackbar,
        visible: false,
      };
      setTimeout(() => {
        state.snackbar = defaultSnack();
      }, 200);
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
