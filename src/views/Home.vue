<template>
  <div class="pa-4 mt-8">
    <home-alerts />
    <pending-inductions />
    <home-links />
  </div>
</template>

<script>
// @ is an alias to /src
import HomeAlerts from '@/components/nav/home-alerts.vue';
import HomeLinks from '@/components/nav/home-links.vue';
import PendingInductions from '@/components/induction/pending.vue';

export default {
  name: 'Home',
  components: {
    HomeAlerts,
    HomeLinks,
    PendingInductions,
  },
};
</script>
