import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { isPublic: true },
  },
];

const router = new VueRouter({
  routes,
  mode: 'history',
});

router.beforeEach((to, from, next) => {
  // eslint-disable-next-line no-console
  console.log(to);
  const isPublic = to.matched.some((record) => !!record.meta.isPublic);
  if (to.path === '/logout') {
    // eslint-disable-next-line no-console
    return store.dispatch('auth/logout').catch(console.error).then(() => next({ path: '/login' }));
  }
  if (isPublic && store.state.auth.user) {
    return next({ path: '/' });
  }
  if (!isPublic && !store.state.auth.user) {
    return next({
      path: '/login',
      query: to.path === '/' ? {} : { followPath: to.path },
    });
  }
  return next();
});

export default router;
