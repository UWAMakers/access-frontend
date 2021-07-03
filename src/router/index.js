import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Feedback from '../views/Feedback.vue';
import Training from '../views/Training.vue';
import Induction from '../views/Induction.vue';
import Email from '../views/Email.vue';
import Review from '../views/Review.vue';

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
    path: '/training-config/:id?',
    name: 'training-config',
    component: () =>
      // eslint-disable-next-line
      import(/* webpackChunkName: "training-config" */ '../views/TrainingConfig.vue'),
    meta: { roles: ['admin', 'super_admin'] },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { isPublic: true },
  },
  {
    path: '/bug-report',
    name: 'Bug Report',
    component: Feedback,
  },
  {
    path: '/training/:id?',
    name: 'Training',
    component: Training,
  },
  {
    path: '/email',
    name: 'Email',
    component: Email,
  },
  {
    path: '/induction/:key?',
    name: 'Induction',
    component: Induction,
  },
  {
    path: '/review/:id',
    name: 'Review',
    component: Review,
  },
];

const router = new VueRouter({
  routes,
  mode: 'history',
});

router.beforeEach((to, from, next) => {
  // eslint-disable-next-line
  const isPublic = to.matched.some(record => !!record.meta.isPublic);
  const user = store.getters['auth/user'];
  if (to.path === '/logout') {
    // eslint-disable-next-line no-console
    return store
      .dispatch('auth/logout')
      .catch(console.error)
      .then(() => next({ path: '/login' }));
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
  if (
    to.matched.some(
      // eslint-disable-next-line
      record => record.meta.roles && !record.meta.roles.some(r => user.roles.includes(r))
    )
  ) {
    return next({ path: '/' });
  }
  return next();
});

export default router;
