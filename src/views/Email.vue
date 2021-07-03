<template>
  <v-container>
    <email-panel></email-panel>
  </v-container>
</template>

<script>
// @ is an alias to /src
import EmailPanel from '@/components/email/email-panel.vue';

export default {
  name: 'Email',
  components: {
    EmailPanel,
  },
};
</script>
