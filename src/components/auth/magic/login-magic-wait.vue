<template>
  <div>
    <v-card-text>
      <p>
        We've sent you an email with a magic link. Click the link to continue.
      </p>
      <p>
        If you don't see the email, be sure to check your spam folder.
      </p>
      <div class="d-flex justify-center mt-8">
        <v-progress-circular size="64" indeterminate />
      </div>
    </v-card-text>
  </div>
</template>

<script>

export default {
  mounted() {
    this.scheduleCheck();
  },
  beforeDestroy() {
    if (this.timeout) clearTimeout(this.timeout);
  },
  methods: {
    scheduleCheck() {
      this.timeout = setTimeout(() => window.requestAnimationFrame(() => this.checkLogin()), 1000);
    },
    async checkLogin() {
      const jwt = localStorage.getItem('feathers-jwt');
      if (!jwt) return this.scheduleCheck();
      // check that the jwt isn't expired
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('feathers-jwt');
        return this.scheduleCheck();
      }
      // check if the jwt is valid
      try {
        await this.$store.dispatch('auth/authenticate', {
          strategy: 'jwt',
          accessToken: jwt,
        });
      } catch (err) {
        localStorage.removeItem('feathers-jwt');
        return this.scheduleCheck();
      }
      // if it is, send success
      return this.$emit('update:action', 'success');
    },
  },
};
</script>
