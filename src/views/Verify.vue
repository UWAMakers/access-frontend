<template>
  <v-row align="center" justify="center" class="full-height">
    <v-col cols="12" sm="8" md="6" lg="4">
      <v-card outlined>
        <v-card-title class="headline">{{ title }}</v-card-title>
        <v-card-text>{{ copy }}</v-card-text>
        <div v-if="loading" class="d-flex justify-center mt-8">
          <v-progress-circular size="64" indeterminate />
        </div>
        <v-card-actions v-if="!loading">
          <v-spacer />
          <v-btn text @click="close()">Close</v-btn>
          <primary-btn to="/">Homepage</primary-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>

export default {
  data() {
    return {
      title: 'Verifying',
      copy: 'Please wait while finish the verification.',
      loading: true,
    };
  },
  computed: {
    apiUrl() {
      let apiUrl = process.env.VUE_APP_API_URL;
      if (apiUrl === '/') apiUrl = window.location.origin;
      if (!/\/$/.test(apiUrl)) apiUrl = `${apiUrl}/`;
      return apiUrl;
    },
  },
  mounted() {
    this.verify();
  },
  methods: {
    async verify() {
      const { token, action } = this.$route.query;
      if (!token || !action) return this.$router.push('/login');
      if (action.startsWith('magic_')) {
        this.title = 'Logging in';
        this.copy = 'Please wait while we log you in.';
        try {
          await this.$store.dispatch('auth/authenticate', {
            strategy: 'magic',
            token,
          });
          this.title = '🎉 Logged in';
          this.copy = 'You have been logged in successfully.';
        } catch (error) {
          this.title = 'Error';
          this.copy = `There was an error logging you in: "${error.message}"`;
          this.$handleError(error, 'verifying magic link');
        }
        this.loading = false;
        return null;
      }
      try {
        await fetch(`${this.apiUrl}tokens-actions/${token}`);
        this.title = '🎉 Success!';
        switch (action) {
          case 'verify_preferred_email':
            this.copy = 'Your preferred email has been verified & updated.';
            break;
          default:
            this.copy = 'Verification was completed successfully.';
            break;
        }
      } catch (error) {
        this.title = 'Error';
        this.copy = `There was an error completing verification: "${error.message}"`;
        this.$handleError(error, 'verifying token');
      }
      this.loading = false;
      return null;
    },
    close() {
      window.close();
    },
  },
};
</script>
