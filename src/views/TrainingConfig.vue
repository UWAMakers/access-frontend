<template>
  <div>
    <v-navigation-drawer width="300" permanent app clipped>
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
            <v-list-item-action class="my-0">
              <item-mover :items="configs" :item="item" @update:items="updateOrder" />
            </v-list-item-action>
            <v-tooltip right>
              <template #activator="{ on }">
                <v-list-item-title v-on="item.name.length > 30 ? on : undefined">
                  {{item.name}}
                </v-list-item-title>
              </template>
              <span>{{item.name}}</span>
            </v-tooltip>
          </v-list-item>

          <v-divider />
        </template>
      </v-virtual-scroll>
    </v-navigation-drawer>
    <training-edit :id="configId" />
  </div>
</template>

<script>
import debouncePromise from 'debounce-promise';
import sortBy from 'lodash/sortBy';
import TrainingEdit from '@/components/trainings/edit.vue';
import TrainingAdd from '@/components/trainings/add.vue';
import ItemMover from '@/components/input/item-mover.vue';
import searchRegex from '@/util/search-regex';

export default {
  components: {
    TrainingEdit,
    TrainingAdd,
    ItemMover,
  },
  data() {
    return {
      search: '',
      loading: true,
      stagedItems: [],
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
        },
      }).data, ['order', (v) => v.name.toLowerCase()]);
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
    updateOrder(items) {
      items.forEach((item, i) => {
        if (item.order !== i) {
          this.$set(item, 'order', i);
          if (!this.stagedItems.some(({ _id }) => _id === item._id)) {
            this.stagedItems.push(item);
          }
        }
      });
      this.saveOrder();
    },
    // eslint-disable-next-line func-names
    saveOrder: debouncePromise(async function () {
      try {
        await Promise.all(this.stagedItems.map(async (item) => {
          await this.$store.dispatch('trainings/patch', [item._id, { order: item.order }]);
        }));
        this.stagedItems = [];
      } catch (err) {
        this.$handleError(err, 'saving training order');
      }
    }, 1000),
  },
};
</script>
