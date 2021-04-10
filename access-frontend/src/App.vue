<template>
  <v-app>
    <Nav />
    <v-main>
      <HelloWorld />
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';
import Nav from './components/nav/Nav.vue';

export default {
  name: 'App',

  components: {
    HelloWorld,
    Nav,
  },

  data: () => ({
    //
  }),
};
</script>
