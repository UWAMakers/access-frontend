<template>
  <div>
    <v-navigation-drawer permanent app clipped>
      <v-list-item>
        <v-list-item-icon class="mr-2">
          <v-icon>mdi-wrench</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="title">
            Training Config
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon class="ml-2">
          <training-add>
            <template #activator="{ on: onAdd }">
              <v-tooltip right>
                <template #activator="{ on: onTooltip }">
                  <v-btn icon small v-on="{ ...onAdd, ...onTooltip }">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <span>Add New Config</span>
              </v-tooltip>
            </template>
          </training-add>
        </v-list-item-icon>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon class="mr-2">
          <v-icon>mdi-database-search</v-icon>
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
        item-height="49"
        bench="1"
      >
        <template v-slot:default="{ item }">
          <v-list-item :key="item._id" :to="`/training-config/${item._id}`">
            <v-list-item-title>
              {{item.name}}
            </v-list-item-title>
          </v-list-item>

          <v-divider />
        </template>
      </v-virtual-scroll>
    </v-navigation-drawer>
    <training-edit :id="configId" />
  </div>
</template>

<script>
import TrainingEdit from '@/components/trainings/edit.vue';
import TrainingAdd from '@/components/trainings/add.vue';
import searchRegex from '@/util/search-regex';

export default {
  components: {
    TrainingEdit,
    TrainingAdd,
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
      const { Training } = this.$FeathersVuex.api;
      const existingIds = Training.findInStore().data.map((u) => u._id);
      this.loading = true;
      try {
        await Training.find({
          query: {
            _id: { $nin: existingIds },
          },
          paginate: false,
        });
      } catch (err) {
        this.$handleError(err, 'loading training configs');
      }
      this.loading = false;
    },
  },
};
</script>
