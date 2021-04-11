<template>
  <div>
    <v-navigation-drawer permanent app clipped>
      <v-list-item>
        <v-list-item-icon class="mr-2">
          <v-icon>mdi-account-circle</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="title">
            User Management
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon class="mr-2">
          <v-icon>mdi-database-search</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-text-field
            v-model.trim="search"
            label="User Search"
            outlined
            dense
            hide-details
          />
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-virtual-scroll
        :items="users"
        height="calc(100% - 56px - 64px - 1px)"
        item-height="69"
        bench="1"
      >
        <template v-slot:default="{ item }">
          <v-list-item :key="item._id" :to="`/users/${item._id}`">
            <v-list-item-icon class="mr-2">
              <user-avatar :user="item" size="36" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{item.name}}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{item.username}}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>
        </template>
      </v-virtual-scroll>
    </v-navigation-drawer>
    <v-row class="pa-4">
      <v-col cols="12">
        <user-edit v-if="userId" :id="userId" />
        <v-card v-else outlined>
          <v-card-text>
            No user selected, select one to get editing.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import UserAvatar from '@/components/users/avatar.vue';
import UserEdit from '@/components/users/edit.vue';
import searchRegex from '@/util/search-regex';

export default {
  components: {
    UserAvatar,
    UserEdit,
  },
  data() {
    return {
      search: '',
      loading: true,
    };
  },
  computed: {
    users() {
      const { User } = this.$FeathersVuex.api;
      const reg = searchRegex(this.search);
      return User.findInStore({
        query: {
          ...(this.search ? {
            $or: [
              { name: reg },
              { firstName: reg },
              { lastName: reg },
              { displayName: reg },
              { username: reg },
            ],
          } : {}),
          $sort: { name: 1, username: 1 },
        },
      }).data;
      // return Array.from({ length: 10000 }, (k, v) => v + 1).map((i) => ({
      //   _id: `5e9d5f23d0d05358${`${i}`.padStart(8, '0')}`,
      //   username: `${i}`.padStart(8, '0'),
      //   firstName: 'User',
      //   lastName: `No. ${i}`,
      // }));
    },
    userId() {
      return this.$route.params.id;
    },
  },
  async mounted() {
    await this.loadUsers();
  },
  methods: {
    async loadUsers() {
      const { User } = this.$FeathersVuex.api;
      const existingIds = User.findInStore().data.map((u) => u._id);
      this.loading = true;
      try {
        await User.find({
          query: {
            _id: { $nin: existingIds },
          },
          paginate: false,
        });
      } catch (err) {
        // TODO: render error
        // eslint-disable-next-line no-console
        console.error(err);
      }
      this.loading = false;
    },
  },
};
</script>
