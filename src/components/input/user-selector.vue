<template>
  <v-dialog v-model="dialog" max-width="300">
    <template #activator="{ on }">
      <slot name="activator" :on="on">
        <primary-btn v-on="on">
          {{label}} ({{value.length}})
        </primary-btn>
      </slot>
    </template>
    <v-card>
      <v-card-title>
        Select {{label}}
      </v-card-title>
      <v-card-text>
        <v-autocomplete
          :key="inputKey"
          :items="users"
          :search-input.sync="search"
          item-value="_id"
          prepend-inner-icon="mdi-account-search-outline"
          hide-no-data
          hide-details
          outlined
          @input="addUser($event)"
        >
          <template #item="{ item }">
            <v-list-item-content>
              <v-list-item-title>
                {{item.name}}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{item.username}}
              </v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-autocomplete>
      </v-card-text>
      <v-list class="user-list">
        <v-list-item v-for="user in selectedUsers" :key="user._id">
          <v-list-item-icon class="mr-2">
            <user-avatar :user="user" size="36" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{user.name}}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{user.username}}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action class="ml-2">
            <v-btn icon @click="removeUser(user._id)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import UserAvatar from '@/components/users/avatar.vue';
import searchRegex from '@/util/search-regex';

export default {
  components: {
    UserAvatar,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    label: {
      type: String,
      default: 'Users',
    },
    excludeIds: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialog: false,
      search: null,
      inputKey: 1,
    };
  },
  computed: {
    users() {
      const { User } = this.$FeathersVuex.api;
      const reg = searchRegex(this.search ?? '');
      return User.findInStore({
        query: {
          _id: { $nin: [...this.value, ...this.excludeIds] },
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
    },
    selectedUsers() {
      const { User } = this.$FeathersVuex.api;
      return User.findInStore({
        query: {
          _id: { $in: this.value },
          $sort: { name: 1, username: 1 },
        },
      }).data;
    },
  },
  watch: {
    dialog(to, from) {
      if (to && !from) this.loadUsers();
    },
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
        this.$handleError(err, 'loading users');
      }
      this.loading = false;
    },
    addUser(id) {
      this.$emit('input', [...this.value, id]);
      this.search = null;
      this.inputKey = Math.random();
    },
    removeUser(id) {
      this.$emit('input', this.value.filter((v) => v !== id));
      this.inputKey = Math.random();
    },
  },
};
</script>

<style scoped>
.user-list {
  max-height: 300px;
  overflow-y: auto;
}
</style>
