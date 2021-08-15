<template>
  <v-row class="pa-4">
    <v-col v-show="!id" cols="12" md="6">
      <v-card outlined>
        <v-card-text>
          No notification template selected, select one to view it's details.
        </v-card-text>
      </v-card>
    </v-col>
    <v-col v-show="id" cols="12">
      <v-card outlined>
        <email-panel></email-panel>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import EmailPanel from '@/components/notification-templates/email-panel.vue';

export default {
  components: {
    EmailPanel,
  },
  props: {},
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
};
</script>
