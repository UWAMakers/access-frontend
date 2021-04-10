<template>
  <v-row align="center" justify="center" class="full-height">
    <v-col cols="12" sm="8" md="6" lg="4">
      <login />
    </v-col>
  </v-row>
</template>

<script>
import Login from '@/components/auth/login.vue';

export default {
  components: {
    Login,
  },
};
</script>
