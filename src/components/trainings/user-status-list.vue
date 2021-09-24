<template>
  <!-- eslint-disable vue/valid-v-slot -->
  <v-card outlined>
    <v-card-title>
      User Status List
      <v-spacer />
      <v-btn-toggle v-model="status">
        <v-btn small value="pending">
          Pending
        </v-btn>
        <v-btn small value="complete">
          Complete
        </v-btn>
      </v-btn-toggle>
    </v-card-title>
    <v-data-table
      :items="completions.data"
      :server-items-length="completions.total"
      :options.sync="options"
      :headers="headers"
      :loading="loading"
      disable-sort
    >
      <template #item.userId="{ item }">
        {{ getUser(item.userId).name }}
      </template>
      <template #item.username="{ item }">
        {{ getUser(item.userId).username }}
      </template>
      <template #item.status="{ item }">
        {{ startCase(item.status) }}
      </template>
      <template #item.items="{ item }">
        {{ formatDate(getInductionCompletedAtTime(item)) }}
      </template>
      <template #item.steps="{ item }">
        <view-items :id="trainingId" :user="getUser(item.userId)" count />
        <v-dialog max-width="500px">
          <template #activator="{ on }">
            <v-btn icon small v-on="on">
              <v-icon small>mdi-information-outline</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              Steps Progress
            </v-card-title>
            <view-items :id="trainingId" :user="getUser(item.userId)" readonly />
          </v-card>
        </v-dialog>
      </template>
      <template #item.actions="{ item }">
        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn icon v-on="on" :to="`/users/${item.userId}`">
              <v-icon>mdi-account-edit-outline</v-icon>
            </v-btn>
          </template>
          <span>Edit</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import tinySha from 'tiny-sha256';
import uniq from 'lodash/uniq';
import { startCase } from 'lodash';
import ViewItems from '@/components/trainings/view-items.vue';
import { format } from 'date-fns';

export default {
  components: {
    ViewItems,
  },
  props: {
    trainingId: {
      type: String,
      required: true,
    },
    filter: {
      type: Object,
      default: () => ({}),
    },
    excludeHeaders: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      completions: { data: [], total: 0 },
      cache: {},
      options: {
        page: 1,
        itemsPerPage: 5,
      },
      status: null,
      loading: true,
    };
  },
  computed: {
    query() {
      const paginate = this.options.itemsPerPage > 0;
      return {
        ...this.filter,
        ...(this.status ? { status: this.status } : {}),
        trainingId: this.trainingId,
        $sort: { createdAt: -1 },
        ...(paginate ? {
          $limit: this.options.itemsPerPage,
          $skip: (this.options.page - 1) * this.options.itemsPerPage,
        } : {}),
      };
    },
    queryKey() {
      return tinySha(JSON.stringify(this.query));
    },
    headers() {
      return [
        { text: 'User', value: 'userId' },
        { text: 'Pheme Number', value: 'username' },
        { text: 'Status', value: 'status' },
        { text: 'Last Induction Completion Time', value: 'items' },
        { text: 'Steps', value: 'steps' },
        { text: 'Actions', value: 'actions' },
      ].filter((header) => !this.excludeHeaders.includes(header.value));
    },
  },
  watch: {
    queryKey() {
      this.loadData();
    },
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    getInductionCompletedAtTime(item) {
      const inductionItems = item.items.filter(({ inductionId }) => !!inductionId);
      const confirmedAtDates = inductionItems.map(({ confirmedAt }) => new Date(confirmedAt));
      confirmedAtDates.sort((a, b) => (b - a));
      const [latestConfirmationDate] = confirmedAtDates;
      return latestConfirmationDate;
    },
    isValidDate(d) {
      return d instanceof Date && !Number.isNaN(d.valueOf());
    },
    formatDate(d) {
      return this.isValidDate(d) ? format(d, 'yyyy-MM-dd HH:mm:ss') : '';
    },
    startCase,
    async loadData() {
      if (!this.trainingId) return;
      const { Completion, User } = this.$FeathersVuex.api;
      if (this.cache[this.queryKey]) {
        this.completions = this.cache[this.queryKey];
        return;
      }
      this.loading = true;
      try {
        const paginate = this.options.itemsPerPage > 0;
        const res = await Completion.find({
          query: this.query,
          paginate,
        });
        this.completions = !paginate ? { data: res, total: res.length } : res;
        this.cache[this.queryKey] = this.completions;
        const userIds = uniq(this.completions.data.map((log) => log.userId));
        const { data: existingUsers } = User.findInStore({
          query: { _id: { $in: userIds } },
        });
        if (existingUsers.length !== userIds.length) {
          await User.find({
            query: {
              _id: {
                $in: userIds.filter((id) => !existingUsers.some((user) => user._id === id)),
              },
            },
            paginate: false,
          });
        }
      } catch (err) {
        this.$handleError(err, 'loading user training completions');
      }
      this.loading = false;
    },
    getUser(userId) {
      const { User } = this.$FeathersVuex.api;
      return User.getFromStore(userId) || {};
    },
  },
};
</script>
