<template>
  <v-row align="center" justify="center" class="full-height">
    <v-col cols="12" sm="8" md="6" lg="4">
      <login-magic />
    </v-col>
  </v-row>
</template>

<script>
import LoginMagic from '@/components/auth/login-magic.vue';

export default {
  components: {
    LoginMagic,
  },
};
</script>
