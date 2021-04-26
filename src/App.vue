<template>
  <v-app>
    <nav-bar v-if="showNav" />
    <v-main>
      <global-snackbar />
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import NavBar from './components/nav/nav-bar.vue';

export default {
  name: 'App',

  components: {
    NavBar,
  },
  computed: {
    showNav() {
      return !this.$route.meta.isPublic;
    },
  },
};
</script>

<style>
.full-height {
  height: 100%;
}

.v-main__wrap {
  padding-bottom: 16px !important;
}
</style>
