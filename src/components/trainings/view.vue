<template>
  <v-row class="pa-4">
    <v-col v-show="!id" cols="12" md="6">
      <v-card outlined>
        <v-card-text>
          No training selected, select one to view it's details and requirements.
        </v-card-text>
      </v-card>
    </v-col>
    <v-col v-show="id" cols="12" md="6">
      <v-card outlined>
        <v-card-title>
          {{config.name}}
          <v-spacer />
          <v-btn v-show="$isAdmin" icon :to="`/training-config/${config._id}`">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div v-html="fromMd(config.desc)" />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col v-show="id" cols="12" md="6">
      <v-card outlined>
        <v-card-title>
          Tasks
        </v-card-title>
        <view-items :id="id" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { fromMd } from '@/util/markdown';
import ViewItems from '@/components/trainings/view-items.vue';

export default {
  components: {
    ViewItems,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  computed: {
    config() {
      const { Training } = this.$FeathersVuex.api;
      return Training.getFromStore(this.id) ?? {};
    },
  },
  methods: {
    fromMd,
  },
};
</script>
