<template>
  <v-snackbar
    v-model="snackbar.visible"
    :timeout="snackbar.timeout"
    :color="snackbar.severity"
    bottom
  >
    <v-icon v-if="statusIcon" left>mdi-{{ statusIcon }}</v-icon>
    {{ snackbar.text }}
    <template #action>
      <primary-btn
        v-show="snackbar.errorReport"
        :loading="loading"
        class="mr-2"
        @click="report"
      >
        Report Error
      </primary-btn>
      <v-btn text @click="closeSnackbar">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'GlobalSnackbar',
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    snackbar() {
      return this.$store.state.snackbar;
    },
    statusIcon() {
      switch (this.snackbar.severity) {
        case 'success': {
          return 'check';
        }
        case 'info': {
          return 'information-variant';
        }
        case 'error':
        case 'warning': {
          return 'alert-circle-outline';
        }
        default: {
          return '';
        }
      }
    },
  },
  methods: {
    ...mapMutations(['closeSnackbar']),
    async report() {
      const { Feedback } = this.$FeathersVuex.api;
      this.loading = true;
      let backend = 'unknown';
      try {
        const url = `${process.env.VUE_APP_API_URL.replace(/\/$/, '')}/version`;
        const { gitHash } = await fetch(url).then((res) => res.json());
        backend = gitHash;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
      const report = new Feedback({
        msg: this.snackbar.errorReport,
        versions: {
          frontend: process.env.VUE_APP_GIT_HASH,
          backend,
        },
      });
      try {
        await report.save();
        this.$success('sent error report');
      } catch (err) {
        this.$handleError(err, 'sending an error report');
      }
      this.loading = false;
    },
  },
};
</script>
