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
    path: '/users/:id?',
    name: 'users',
    component: () => import(/* webpackChunkName: "users" */ '../views/Users.vue'),
    meta: { roles: ['admin', 'super_admin'] },
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
  const user = store.getters['auth/user'];
  if (to.path === '/logout') {
    // eslint-disable-next-line no-console
    return store.dispatch('auth/logout').catch(console.error).then(() => next({ path: '/login' }));
  }
  if (isPublic && user) {
    return next({ path: '/' });
  }
  if (!isPublic && !user) {
    return next({
      path: '/login',
      query: to.path === '/' ? {} : { followPath: to.path },
    });
  }
  if (to.matched.some((record) => record.meta.roles
    && !record.meta.roles.some((r) => user.roles.includes(r)))) {
    return next({ path: '/' });
  }
  return next();
});

export default router;
