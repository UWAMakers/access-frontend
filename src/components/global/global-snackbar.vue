<template>
  <v-snackbar
    bottom
    v-model="snackbar.visible"
    :timeout="snackbar.timeout"
    :color="snackbar.severity"
  >
    <v-icon v-if="statusIcon(snackbar.severity)"> mdi-{{ statusIcon(snackbar.severity) }}</v-icon>
    {{ snackbar.text }}
    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="closeSnackbar">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'GlobalSnackbar',
  computed: {
    snackbar() {
      return this.$store.state.snackbar;
    },
  },
  methods: {
    ...mapMutations(['closeSnackbar']),
    statusIcon(status) {
      switch (status) {
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
};
</script>

>
