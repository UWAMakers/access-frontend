<template>
  <v-btn
    :light="!this.$vuetify.theme.dark"
    class="mr-2"
    icon
    @click="toggleDarkMode()"
  >
    <v-icon>
      mdi-lightbulb-{{this.$vuetify.theme.dark ? 'on' : 'off'}}
    </v-icon>
  </v-btn>
</template>

<script>
import debouncePromise from 'debounce-promise';

export default {
  data: () => ({}),
  mounted() {
    if (this.$user.preferences) {
      this.$vuetify.theme.dark = !!this.$user.preferences.dark;
    }
  },
  watch: {
    '$user.preferences.dark': {
      handler(to, from) {
        if (to === from || to === this.$vuetify.theme.dark) return;
        this.$vuetify.theme.dark = to;
      },
    },
  },
  methods: {
    toggleDarkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.savePref();
    },
    // eslint-disable-next-line func-names
    savePref: debouncePromise(async function () {
      try {
        if (!this.$user.preferences) this.$user.preferences = {};
        this.$user.preferences.dark = this.$vuetify.theme.dark;
        await this.$user.save();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }, 1000),
  },
};
</script>
