<template>
  <!-- eslint-disable vue/valid-v-slot -->
  <v-data-table
    :items="logs.data"
    :server-items-length="logs.total"
    :options.sync="options"
    :headers="headers"
    :loading="loading"
    disable-sort
  >
    <template #item.trainingId="{ item }">
      {{ getTrainingName(item.trainingId) }}
    </template>
    <template #item.userId="{ item }">
      {{ getUserName(item.userId) }}
    </template>
    <template #item.granted="{ item }">
      {{ item.granted ? 'Yes' : 'No' }}
    </template>
    <template #item.test="{ item }">
      {{ item.test ? 'Yes' : 'No' }}
    </template>
    <template #item.createdAt="{ item }">
      {{ dayjs(item.createdAt).format('D/M/YYYY H:mma') }}
    </template>
  </v-data-table>
</template>

<script>
import tinySha from 'tiny-sha256';
import uniq from 'lodash/uniq';
import dayjs from 'dayjs';

export default {
  props: {
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
      logs: { data: [], total: 0 },
      logCache: {},
      options: {
        page: 1,
        itemsPerPage: 10,
      },
      loading: true,
      dayjs,
    };
  },
  computed: {
    query() {
      return {
        ...this.filter,
        $sort: { createdAt: -1 },
        $limit: this.options.itemsPerPage,
        $skip: (this.options.page - 1) * this.options.itemsPerPage,
      };
    },
    queryKey() {
      return tinySha(JSON.stringify(this.query));
    },
    headers() {
      return [
        { text: 'Resource', value: 'trainingId' },
        { text: 'User', value: 'userId' },
        { text: 'Granted', value: 'granted' },
        { text: 'Time', value: 'createdAt' },
        ...(this.logs.data.some((log) => log.test) ? [
          { text: 'Test', value: 'test' },
        ] : []),
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
    async loadData() {
      const { Access, User, Training } = this.$FeathersVuex.api;
      if (this.logCache[this.queryKey]) {
        this.logs = this.logCache[this.queryKey];
        return;
      }
      this.loading = true;
      try {
        const res = await Access.find({ query: this.query });
        this.logCache[this.queryKey] = res;
        this.logs = res;
        const userIds = uniq(res.data.map((log) => log.userId));
        const trainingIds = uniq(res.data.map((log) => log.trainingId));
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
        const { data: existingTraining } = Training.findInStore({
          query: { _id: { $in: trainingIds } },
        });
        if (existingTraining.length !== trainingIds.length) {
          await Training.find({
            query: {
              _id: {
                $in: trainingIds
                  .filter((id) => !existingTraining.some((training) => training._id === id)),
              },
            },
            paginate: false,
          });
        }
      } catch (err) {
        this.$handleError(err, 'loading logs');
      }
      this.loading = false;
    },
    getUserName(userId) {
      const { User } = this.$FeathersVuex.api;
      return User.getFromStore(userId)?.name;
    },
    getTrainingName(trainingId) {
      const { Training } = this.$FeathersVuex.api;
      return Training.getFromStore(trainingId)?.name;
    },
  },
};
</script>
