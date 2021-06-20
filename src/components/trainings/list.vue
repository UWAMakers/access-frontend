<template>
  <div style="height: 100%">
    <v-list-item>
      <v-list-item-icon class="mr-2">
        <v-icon>mdi-school-outline</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="title">
          Training
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-icon class="mr-2">
        <v-icon>mdi-magnify</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-text-field
          v-model.trim="search"
          label="Search"
          outlined
          dense
          hide-details
        />
      </v-list-item-content>
    </v-list-item>

    <v-divider />
    <v-virtual-scroll
      :items="configs"
      :height="height"
      item-height="56"
      bench="1"
    >
      <template v-slot:default="{ item }">
        <v-list-item
          :key="`${user && user._id}-${item._id}`"
          :to="to ? to.replaceAll(':id', item._id) : undefined"
          :class="{ 'v-list-item--active': value === item._id }"
          @click="$emit('input', item._id)"
        >
          <v-list-item-icon class="mr-4">
            <v-tooltip right>
              <template #activator="{ on }">
                <v-icon
                  :color="item.status(user).color"
                  v-on="on"
                >
                  {{ item.status(user).icon }}
                </v-icon>
              </template>
              <span>{{item.status(user).text}}</span>
            </v-tooltip>
          </v-list-item-icon>
          <v-list-item-title>
            {{item.name}}
          </v-list-item-title>
        </v-list-item>

        <v-divider />
      </template>
    </v-virtual-scroll>
  </div>
</template>

<script>
import sortBy from 'lodash/sortBy';
import searchRegex from '@/util/search-regex';

export default {
  props: {
    user: {
      type: Object,
      default: null,
    },
    height: {
      type: String,
      default: '',
    },
    to: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      search: '',
      loadedUsers: [],
    };
  },
  computed: {
    configs() {
      const { Training } = this.$FeathersVuex.api;
      const reg = searchRegex(this.search);
      return sortBy(Training.findInStore({
        query: {
          ...(this.search ? {
            $or: [
              { name: reg },
            ],
          } : {}),
          $sort: { name: 1 },
        },
      }).data, [(v) => v.isLocked(), 'order', (v) => v.name?.toLowerCase()]);
    },
  },
  async mounted() {
    await this.loadCompletions();
  },
  watch: {
    'user._id': {
      async handler() {
        await this.loadCompletions();
      },
    },
  },
  methods: {
    async loadCompletions() {
      if (!this.user?._id || this.loadedUsers.includes(this.user._id)) return;
      const { Completion, Review } = this.$FeathersVuex.api;
      const existingCompIds = Completion.findInStore().data.map((u) => u._id);
      const existingReviewIds = Review.findInStore().data.map((r) => r._id);
      try {
        await Completion.find({
          query: {
            _id: { $nin: existingCompIds },
            userId: this.user._id,
          },
          paginate: false,
        });
        await Review.find({
          query: {
            _id: { $nin: existingReviewIds },
            userId: this.user._id,
          },
          paginate: false,
        });
        this.loadedUsers.push(this.user._id);
      } catch (err) {
        this.$handleError(err, 'loading users completed training');
      }
    },
  },
};
</script>
