<template>
  <v-row justify="center" align="center" class="full-height px-3">
    <v-col v-if="loading" cols="12" sm="6" md="4" lg="3" class="my-2 text-center">
      <v-progress-circular indeterminate />
    </v-col>
    <v-col v-else-if="!item" cols="12" sm="6" md="4" lg="3" class="my-2">
      <v-card outlined>
        <v-card-title>No Document Found.</v-card-title>
        <v-card-text>If this is a mistake, please report it.</v-card-text>
        <v-card-actions>
          <primary-btn to="/">Go Home</primary-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col v-else cols="12" sm="8" md="6" lg="4" class="my-2">
      <v-card outlined>
        <v-card-title>{{item.name}}</v-card-title>
        <v-card-text>
          Please click on the "Open &amp; Review" button bellow, review it entirely,
          then come back here to make the declaration.
        </v-card-text>
        <v-card-actions>
          <primary-btn
            :href="item.url"
            :loading="loadingReview"
            target="_blank"
            @click="createReview"
          >
            Open &amp; Review
            <v-icon right x-small>
              mdi-open-in-new
            </v-icon>
          </primary-btn>
        </v-card-actions>
        <v-divider />
        <v-card-title>Declaration</v-card-title>
        <v-card-text>
          I have fully reviewed this and agree with it's contents.
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="$router.back()">Go Back</v-btn>
          <v-spacer />
          <primary-btn
            :disabled="!review"
            :loading="loadingReview"
            @click="confirm"
          >
            I Agree
          </primary-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>

export default {
  data() {
    return {
      loading: false,
      loadingReview: false,
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    item() {
      const { TrainingItem } = this.$FeathersVuex.api;
      return TrainingItem.getFromStore(this.id);
    },
    review() {
      const { Review } = this.$FeathersVuex.api;
      return Review.findInStore({
        query: {
          itemId: this.id,
          userId: this.$user._id,
        },
      }).data?.[0];
    },
  },
  watch: {
    async id(to, from) {
      if (to !== from) await this.loadItem();
    },
  },
  async mounted() {
    await this.loadItem();
  },
  methods: {
    async loadItem() {
      if (!this.id) return;
      const { TrainingItem, Review } = this.$FeathersVuex.api;
      this.loading = true;
      try {
        if (!this.item) {
          await TrainingItem.get(this.id);
        }
        if (!this.review) {
          await Review.find({
            query: {
              itemId: this.id,
              userId: this.$user._id,
              url: this.item.url,
            },
          });
        }
      } catch (err) {
        this.$handleError(err, 'loading document review');
      }
      this.loading = false;
    },
    async createReview() {
      if (this.review) return;
      const { Review } = this.$FeathersVuex.api;
      this.loadingReview = true;
      try {
        const review = new Review({
          itemId: this.id,
          userId: this.$user._id,
          url: this.item.url,
        });
        await review.save();
      } catch (err) {
        this.$handleError(err, 'creating document review');
      }
      this.loadingReview = false;
    },
    async confirm() {
      if (!this.review) return;
      this.loadingReview = true;
      try {
        this.review.confirmedAt = new Date();
        await this.review.save();
        this.$router.back();
      } catch (err) {
        this.$handleError(err, 'confirming document review');
      }
      this.loadingReview = false;
    },
  },
};
</script>
