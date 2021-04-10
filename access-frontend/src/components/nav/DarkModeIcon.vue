<template>
  <div>
    <v-btn light class="mr-2" icon v-if="!this.$vuetify.theme.dark" @click="toggleDarkMode()">
      <v-icon>
        mdi-lightbulb-off
      </v-icon>
    </v-btn>
    <v-btn dark class="mr-2" icon v-else @click="toggleDarkMode()">
      <v-icon>
        mdi-lightbulb-on
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'DarkModeIcon',

  data: () => ({}),
  methods: {
    toggleDarkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
  },
};
</script>
