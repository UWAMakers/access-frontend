<template>
  <v-row justify="center" align="center" class="full-height">
    <v-col cols="12" sm="6" class="my-2">
      <feedback />
    </v-col>
  </v-row>
</template>

<script>
// @ is an alias to /src
import Feedback from '@/components/feedback/feedback.vue';

export default {
  name: 'Home',
  components: {
    Feedback,
  },
};
</script>
