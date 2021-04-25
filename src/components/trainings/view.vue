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
        <v-list class="py-0">
          <template v-for="(item, i) in items">
            <v-divider :key="`divider-${item._id}`" />
            <v-list-item
              :key="`item-${item._id}`"
              :href="item.url || undefined"
              :to="item.trainingId || undefined"
              :target="!item.trainingId ? '_blank' : ''"
            >
              <v-tooltip top>
                <template #activator="{ on }">
                  <v-list-item-content v-on="on">
                    <v-list-item-title>
                      {{i + 1}}. {{item.name}}
                    </v-list-item-title>
                    <v-list-item-subtitle v-show="item.desc">
                      {{item.desc}}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
                <div>
                  {{item.name}}<br>
                  {{item.desc}}
                </div>
              </v-tooltip>
              <v-list-item-action v-show="(item.trainingId || item.url)">
                <primary-btn small>
                  {{btnText(item)}}
                  <v-icon v-show="!item.trainingId" right x-small>mdi-open-in-new</v-icon>
                </primary-btn>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { fromMd } from '@/util/markdown';

export default {
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
    items() {
      if (!this.config?.itemIds) return [];
      const { TrainingItem } = this.$FeathersVuex.api;
      const { data: items } = TrainingItem.findInStore({
        query: {
          _id: { $in: this.config.itemIds },
        },
      });
      return this.config?.itemIds
        .map((id) => items.find((item) => item._id === id)).filter((v) => v);
    },
  },
  watch: {
    'config._id': {
      async handler(to, from) {
        if (to && to !== from) await this.loadItems();
      },
    },
  },
  async mounted() {
    await this.loadItems();
  },
  methods: {
    fromMd,
    async loadItems() {
      if (!this.config?.itemIds) return;
      const { TrainingItem } = this.$FeathersVuex.api;
      const missingIds = this.config.itemIds
        .filter((id) => !this.items.some((item) => item._id === id));
      if (!missingIds.length) return;
      this.loading = true;
      try {
        await TrainingItem.find({
          query: {
            _id: { $in: missingIds },
          },
          paginate: false,
        });
      } catch (err) {
        this.$handleError(err, 'loading training items');
      }
      this.loading = false;
    },
    btnText(item) {
      switch (item.type) {
        case 'quiz':
          return 'Take Quiz';
        case 'induction':
          return 'Schedule';
        case 'completion':
          return 'View Training';
        default:
          return 'Open';
      }
    },
  },
};
</script>
