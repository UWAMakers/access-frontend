<template>
  <div class="pa-4">
    <pending-inductions />
    <home-links />
  </div>
</template>

<script>
// @ is an alias to /src
import HomeLinks from '@/components/nav/home-links.vue';
import PendingInductions from '@/components/induction/pending.vue';

export default {
  name: 'Home',
  components: {
    HomeLinks,
    PendingInductions,
  },
};
</script>
