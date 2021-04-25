export default {
  computed: {
    $user() {
      return this.$store.getters['auth/user'];
    },
    $isAdmin() {
      return !!(this.$user?.roles?.includes('admin') || this.$user?.roles?.includes('super_admin'));
    },
    $isSuperAdmin() {
      return !!this.$user?.roles?.includes('super_admin');
    },
    $isDev() {
      return process.env.NODE_ENV !== 'production';
    },
  },
};
