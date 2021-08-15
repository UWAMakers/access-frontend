<template>
  <div class="pa-4">
    <home-links />
  </div>
</template>

<script>
// @ is an alias to /src
import HomeLinks from '@/components/nav/home-links.vue';

export default {
  name: 'Home',
  components: {
    HomeLinks,
  },
};
</script>
