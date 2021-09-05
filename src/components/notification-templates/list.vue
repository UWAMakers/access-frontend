<template>
  <div style="height: 100%">
    <v-list-item>
      <v-list-item-icon class="mr-2">
        <v-icon>mdi-at</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="title"> Email </v-list-item-title>
      </v-list-item-content>
      <v-list-item-icon class="ml-2">
        <notification-add>
          <template #activator="{ on: onAdd }">
            <v-tooltip right>
              <template #activator="{ on: onTooltip }">
                <v-btn icon small v-on="{ ...onAdd, ...onTooltip }">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>Add New Template</span>
            </v-tooltip>
          </template>
        </notification-add>
      </v-list-item-icon>
    </v-list-item>
    <v-list-item>
      <v-list-item-icon class="mr-2">
        <v-icon>mdi-magnify</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-text-field v-model.trim="search" label="Search" outlined dense hide-details />
      </v-list-item-content>
    </v-list-item>

    <v-divider />
    <v-virtual-scroll :items="configs" :height="height" item-height="49" bench="1">
      <template v-slot:default="{ item }">
        <v-list-item
          :key="`${item._id}`"
          :to="to ? to.replaceAll(':id', item._id) : undefined"
          :class="{ 'v-list-item--active': value === item._id }"
          @click="$emit('input', item._id)"
        >
          <v-list-item-icon class="mr-4"> </v-list-item-icon>
          <v-list-item-title>
            {{ item.name }}
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
import NotificationAdd from '@/components/notification-templates/add.vue';

export default {
  components: {
    NotificationAdd,
  },
  props: {
    height: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    to: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      search: '',
    };
  },
  async mounted() {
    this.loadConfigs();
  },
  methods: {
    async loadConfigs() {
      const { NotificationTemplates } = this.$FeathersVuex.api;
      const existingIds = NotificationTemplates.findInStore().data.map((item) => item.id);
      this.loading = true;
      try {
        await NotificationTemplates.find({
          query: {
            _id: { $nin: existingIds },
          },
          paginate: false,
        });
      } catch (err) {
        this.$handleError(err, 'loading training');
      }
    },
  },
  computed: {
    configs() {
      const { NotificationTemplates } = this.$FeathersVuex.api;
      const reg = searchRegex(this.search);
      return sortBy(
        NotificationTemplates.findInStore({
          query: {
            ...(this.search
              ? {
                $or: [{ name: reg }],
              }
              : {}),
            $sort: { name: 1 },
          },
        }).data,
      );
    },
  },
};
</script>
