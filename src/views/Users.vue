<template>
  <div>
    <v-navigation-drawer width="300" permanent app clipped>
      <v-list-item>
        <v-list-item-icon class="mr-2">
          <v-icon>mdi-account-circle</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="title">
            Users
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action v-if="$isSuperAdmin">
          <export-users :filter="{ 'preferences.joinedAt': { $gt: (new Date(0)).toJSON() } }" />
        </v-list-item-action>
        <v-list-item-action v-if="$isSuperAdmin">
          <add-user-dialog>
            <template #activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon>mdi-account-plus</v-icon>
              </v-btn>
            </template>
          </add-user-dialog>
        </v-list-item-action>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon class="mr-2">
          <v-icon>mdi-database-search</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-text-field v-model.trim="search" label="User Search" outlined dense hide-details />
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
          <v-list-item :key="item._id" :to="`/user/${item._id}`">
            <v-list-item-icon class="mr-2">
              <user-avatar :user="item" size="36" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ item.username }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>
        </template>
      </v-virtual-scroll>
    </v-navigation-drawer>
    <v-row class="pa-4">
      <v-col cols="12" lg="6">
        <user-edit v-if="userId" :id="userId" />
        <v-card v-else outlined>
          <v-card-text>
            No user selected, select one to get editing.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="user" cols="12" sm="6" lg="3">
        <v-card outlined>
          <training-list
            v-model="trainingId"
            :user="user"
            height="400px"
          />
        </v-card>
      </v-col>
      <v-col v-if="trainingId" cols="12" sm="6" lg="3">
        <v-card outlined>
          <v-card-title>Training Progress</v-card-title>
          <view-items
            :id="trainingId"
            :user="user"
            readonly
          />
        </v-card>
      </v-col>
      <v-col v-if="userId" cols="12" lg="6">
        <v-card outlined>
          <v-card-title>
            Card Access Log
            <v-spacer />
            <access-filter-dialog v-model="logFilter" hide-user-selector />
          </v-card-title>
          <access-log :filter="{ userId, ...logFilter }" :exclude-headers="['userId']" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import UserAvatar from '@/components/users/avatar.vue';
import UserEdit from '@/components/users/edit.vue';
import TrainingList from '@/components/trainings/list.vue';
import ViewItems from '@/components/trainings/view-items.vue';
import AccessLog from '@/components/access/log.vue';
import AccessFilterDialog from '@/components/access/filter-dialog.vue';
import searchRegex from '@/util/search-regex';
import ExportUsers from '@/components/users/export-users.vue';
import AddUserDialog from '@/components/users/add-user-dialog.vue';

export default {
  components: {
    UserAvatar,
    UserEdit,
    TrainingList,
    ViewItems,
    AccessLog,
    AccessFilterDialog,
    ExportUsers,
    AddUserDialog,
  },
  data() {
    return {
      search: '',
      loading: true,
      trainingId: null,
      logFilter: {},
    };
  },
  computed: {
    users() {
      const { User } = this.$FeathersVuex.api;
      const reg = searchRegex(this.search);
      return User.findInStore({
        query: {
          ...(this.search
            ? {
              $or: [
                { name: reg },
                { firstName: reg },
                { lastName: reg },
                { displayName: reg },
                { username: reg },
              ],
            }
            : {}),
          $sort: { name: 1, username: 1 },
        },
      }).data;
    },
    userId() {
      return this.$route.params.id;
    },
    user() {
      return this.users.find((u) => u._id === this.userId);
    },
  },
  async mounted() {
    await this.loadUsers();
  },
  methods: {
    async loadUsers() {
      const { User, Training } = this.$FeathersVuex.api;
      const existingIds = User.findInStore().data.map((u) => u._id);
      const existingTrainIds = Training.findInStore().data.map((u) => u._id);
      this.loading = true;
      try {
        await User.find({
          query: {
            _id: { $nin: existingIds },
          },
          paginate: false,
        });
        await Training.find({
          query: {
            _id: { $nin: existingTrainIds },
          },
          paginate: false,
        });
      } catch (err) {
        this.$handleError(err, 'loading users');
      }
      this.loading = false;
    },
  },
};
</script>
