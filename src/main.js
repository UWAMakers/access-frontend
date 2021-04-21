import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import authMixin from './mixins/auth.mixin';
import errorMixin from './mixins/error.mixin';

Vue.config.productionTip = false;

Vue.mixin(authMixin);
Vue.mixin(errorMixin);

const requireModule = require.context(
  // The path where the service modules live
  './components/global',
  // Whether to look in subfolders
  false,
  // Only include .js files (prevents duplicate imports`)
  /\.vue$/,
);
requireModule
  .keys()
  .map((modulePath) => requireModule(modulePath).default)
  .forEach((comp) => Vue.component(comp.name, comp));

store.dispatch('auth/authenticate').catch(() => store.dispatch('auth/logout')).then(() => {
  new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount('#app');
});
