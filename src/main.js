import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import authMixin from './mixins/auth.mixin';

Vue.config.productionTip = false;

Vue.mixin(authMixin);

store.dispatch('auth/authenticate').catch(() => store.dispatch('auth/logout')).then(() => {
  new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount('#app');
});
