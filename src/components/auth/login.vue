<template>
  <v-card outlined>
    <v-img alt="UWA Makers" src="/logo.png" contain width="80%" class="mx-auto mt-2" />
    <v-card-title>Login</v-card-title>
    <v-card-text>
      <v-alert v-show="errMsg" color="error">
        There was a problem logging you in:<br />
        {{ errMsg }}
      </v-alert>
      <v-text-field
        v-model.trim="username"
        label="Pheme Number"
        placeholder="12345678"
        outlined
        @keypress.enter="submit()"
      />
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        outlined
        @keypress.enter="submit()"
      />
    </v-card-text>
    <v-card-actions>
      <card-reader
        v-model="isScanning"
        label="Login w/ Card"
        ref="scanner"
        @scan="submit"
      />
      <v-spacer />
      <primary-btn :disabled="!username || !password" :loading="loading" @click="submit()">
        Login
      </primary-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import CardReader from '@/components/input/card-reader.vue';

export default {
  components: {
    CardReader,
  },
  data() {
    return {
      username: '',
      password: '',
      loading: false,
      isScanning: false,
      errMsg: '',
    };
  },
  methods: {
    async submit(uuid) {
      if (!uuid && (!this.username || !this.password)) return;
      this.loading = true;
      this.errMsg = '';
      try {
        await this.$store.dispatch('auth/authenticate', {
          strategy: 'local',
          ...(uuid ? { uuid } : {
            username: this.username,
            password: this.password,
          }),
        });
        if (this.$route.query.followPath) {
          this.$router.push(this.$route.query.followPath);
        } else {
          this.$router.push('/');
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        this.errMsg = error.message;
        this.loading = false;
      }
    },
  },
};
</script>
