<template>
  <v-card outlined>
    <v-card-title> Report a bug </v-card-title>
    <v-card-text>
      Please try to describe the problem as clearly as possible. We will be in touch for further
      details if required.
      <v-textarea v-model="msg" label="Description" class="mt-4" counter outlined auto-grow />
    </v-card-text>
    <v-card-actions>
      <primary-btn v-show="$isDev" @click="testError">Brew Coffee</primary-btn>
      <v-col cols="auto">
        <small>
          <version ref="version" />
        </small>
      </v-col>
      <v-spacer />
      <primary-btn :loading="loading" :disabled="!msg" @click="submit"> Submit </primary-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Version from '@/components/general/version.vue';
import { mapMutations } from 'vuex';

export default {
  components: {
    Version,
  },
  data: () => ({
    msg: '',
    loading: false,
  }),
  methods: {
    ...mapMutations(['showSnackbar', 'closeSnackbar']),
    async submit() {
      this.loading = true;
      const { Feedback } = this.$FeathersVuex.api;
      const { frontendVersion, backendVersion } = this.$refs.version;
      const newFeedback = new Feedback({
        msg: this.msg,
        versions: {
          frontend: frontendVersion,
          backend: backendVersion,
        },
      });
      try {
        await newFeedback.save();
        this.msg = '';
        this.$success('sent feedback');
      } catch (err) {
        this.$handleError(err, 'sending feedback');
      }
      this.loading = false;
    },
    testError() {
      this.$handleError(new Error("418 I'm a Teapot"), 'brewing coffee');
    },
  },
};
</script>
