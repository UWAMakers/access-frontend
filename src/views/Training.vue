<template>
  <div>
    <v-navigation-drawer width="300" permanent app clipped>
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
        height="calc(100% - 60px - 64px - 1px)"
        item-height="56"
        bench="1"
      >
        <template v-slot:default="{ item }">
          <v-list-item :key="item._id" :to="`/training/${item._id}`">
            <v-list-item-icon class="mr-4">
              <v-tooltip right>
                <template #activator="{ on }">
                  <v-icon
                    :color="itemStatus(item).color"
                    v-on="on"
                  >
                    {{ itemStatus(item).icon }}
                  </v-icon>
                </template>
                <span>{{itemStatus(item).text}}</span>
              </v-tooltip>
            </v-list-item-icon>
            <v-list-item-title>
              {{item.name}}
            </v-list-item-title>
          </v-list-item>

          <v-divider />
        </template>
      </v-virtual-scroll>
    </v-navigation-drawer>
    <training-view :id="configId" />
  </div>
</template>

<script>
import TrainingView from '@/components/trainings/view.vue';
import searchRegex from '@/util/search-regex';

export default {
  components: {
    TrainingView,
  },
  data() {
    return {
      search: '',
      loading: true,
    };
  },
  computed: {
    configs() {
      const { Training } = this.$FeathersVuex.api;
      const reg = searchRegex(this.search);
      return Training.findInStore({
        query: {
          ...(this.search ? {
            $or: [
              { name: reg },
            ],
          } : {}),
          $sort: { name: 1 },
        },
      }).data;
    },
    configId() {
      return this.$route.params.id;
    },
  },
  async mounted() {
    await this.loadConfigs();
  },
  methods: {
    async loadConfigs() {
      const { Training, Completion, Review } = this.$FeathersVuex.api;
      const existingIds = Training.findInStore().data.map((u) => u._id);
      const existingCompIds = Completion.findInStore().data.map((u) => u._id);
      const existingReviewIds = Review.findInStore().data.map((r) => r._id);
      this.loading = true;
      try {
        await Training.find({
          query: {
            _id: { $nin: existingIds },
          },
          paginate: false,
        });
        await Completion.find({
          query: {
            _id: { $nin: existingCompIds },
            userId: this.$user._id,
          },
          paginate: false,
        });
        await Review.find({
          query: {
            _id: { $nin: existingReviewIds },
            userId: this.$user._id,
          },
          paginate: false,
        });
      } catch (err) {
        this.$handleError(err, 'loading training');
      }
      this.loading = false;
    },
    itemStatus(item) {
      if (item.isLocked()) return { text: 'Locked (You must complete other training first)', icon: 'mdi-lock-outline' };
      if (item.completion?.()?.status === 'complete') return { text: 'Completed', color: 'success', icon: 'mdi-check-circle-outline' };
      return { text: 'Pending Completion', color: 'warning', icon: 'mdi-minus-circle-outline' };
    },
  },
};
</script>
