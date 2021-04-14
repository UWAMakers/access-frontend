<template>
  <div class="home">
    <feedback />
  </div>
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
