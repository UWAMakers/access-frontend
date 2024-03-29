<template>
  <v-list v-if="!count" class="py-0">
    <template v-for="(item, i) in items">
      <v-divider :key="`divider-${item._id}`" />
      <v-list-item
        :key="`item-${item._id}`"
        :href="!readonly && /^http/.test(itemUrl(item)) ? itemUrl(item) : undefined"
        :to="!readonly && !/^http/.test(itemUrl(item)) ? itemUrl(item) : undefined"
        :target="!readonly && /^http/.test(itemUrl(item)) ? '_blank' : ''"
      >
        <v-list-item-icon class="mr-2">
          <v-icon v-if="itemStatus(item)" color="success">mdi-check-circle-outline</v-icon>
          <v-icon v-else-if="itemStatus(item) === false" color="error">
            mdi-close-circle-outline
          </v-icon>
          <v-icon v-else-if="item.type !== 'comment'">mdi-circle-outline</v-icon>
        </v-list-item-icon>
        <v-tooltip top disabled>
          <template #activator="{ on }">
            <v-list-item-content v-on="on">
              <v-list-item-title style="white-space: inherit">
                {{i + 1}}. {{item.name}}
              </v-list-item-title>
              <v-list-item-subtitle v-show="item.desc">
                {{item.desc}}
              </v-list-item-subtitle>
            </v-list-item-content>
          </template>
          <div>
            <strong>{{item.name}}</strong>
            <br>
            {{item.desc}}
          </div>
        </v-tooltip>
        <v-list-item-action v-show="!readonly && (item.trainingId || item.url)">
          <primary-btn small>
            {{btnText(item)}}
            <v-icon v-show="/^http/.test(itemUrl(item))" right x-small>
              mdi-open-in-new
            </v-icon>
          </primary-btn>
        </v-list-item-action>
      </v-list-item>
    </template>
  </v-list>
  <span v-else>
    {{totalCompleted}} / {{requiredItems.length}}
  </span>
</template>

<script>
import dayjs from 'dayjs';

export default {
  props: {
    user: {
      type: Object,
      default: null,
    },
    id: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    count: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loadedTraining: [],
    };
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
    requiredItems() {
      return this.items.filter((item) => item.type !== 'comment' && item.required);
    },
    totalCompleted() {
      return this.requiredItems.filter((item) => this.itemStatus(item)).length;
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
    async loadItems() {
      if (!this.config?.itemIds || this.loadedTraining.includes(this.config._id)) return;
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
        this.loadedTraining.push(this.config._id);
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
        case 'review':
          return 'Review';
        default:
          return 'Open';
      }
    },
    itemUrl(item) {
      switch (item.type) {
        case 'quiz':
        case 'induction':
        case 'comment':
          return item.url;
        case 'completion':
          return `/training/${item.trainingId}`;
        case 'review':
          return `/review/${item._id}`;
        default:
          return undefined;
      }
    },
    getCompItem(item) {
      return this.config?.completion?.(this.user)?.items
        ?.find((compItem) => compItem.itemId === item._id);
    },
    getExpiry(item) {
      const compItem = this.getCompItem(item);
      return compItem?.confirmedAt && item.expiry ? dayjs(compItem.confirmedAt).add(item.expiry, 'w') : null;
    },
    itemStatus(item) {
      if (item.type === 'comment') return null;
      const res = (val) => (!val && !item.required ? null : !!val);
      const compItem = this.getCompItem(item);
      if (!compItem) return res(false);
      const expiry = this.getExpiry(item);
      const validExpiry = !expiry || expiry.valueOf() > Date.now();
      if (['induction', 'review'].includes(item.type)) {
        return res(compItem.confirmedAt && validExpiry);
      }
      if (item.type === 'quiz') {
        return res(
          compItem.confirmedAt
          && validExpiry
          && compItem.score >= (item.requiredScore ?? 0.5),
        );
      }
      if (item.type === 'completion') {
        return res(
          compItem.confirmedAt
          && validExpiry
          && compItem.status === 'complete',
        );
      }
      return null;
    },
  },
};
</script>
