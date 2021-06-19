<template>
  <div>
    <v-navigation-drawer width="300" permanent app clipped>

      <training-list
        to="/training/:id"
        height="calc(100% - 60px - 64px - 1px)"
      />
    </v-navigation-drawer>
    <training-view :id="configId" />
  </div>
</template>

<script>
import TrainingView from '@/components/trainings/view.vue';
import TrainingList from '@/components/trainings/list.vue';

export default {
  components: {
    TrainingView,
    TrainingList,
  },
  data() {
    return {
      loading: true,
    };
  },
  computed: {
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
  },
};
</script>
