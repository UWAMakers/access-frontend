<template>
  <div>
    <v-navigation-drawer width="300" permanent app clipped>
      <email-list height="calc(100% - 60px - 64px - 1px)" to="/email/:id" />
    </v-navigation-drawer>
    <email-view :id="configId" />
  </div>
</template>

<script>
// @ is an alias to /src
import EmailList from '@/components/notification-templates/list.vue';
import EmailView from '@/components/notification-templates/email-panel.vue';

export default {
  name: 'Email',
  components: {
    EmailList,
    EmailView,
  },
  computed: {
    configId() {
      return this.$route.params.id;
    },
  },
};
</script>
