<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template #activator="{ on }">
      <slot name="activator" :on="on"></slot>
    </template>
    <v-card>
      <v-card-title class="mb-4">
        <v-row align="center">
          <v-col cols="auto">
            <user-avatar :user="$user" size="64" />
          </v-col>
          <v-col>
            <div class="text-h5">{{ user.name }}</div>
            <div v-show="user.name === user.displayName" class="text-caption">
              {{ user.firstName }} {{ user.lastName }}
            </div>
            <div class="text-caption">
              {{ user.username }}
              &mdash;
              {{ user.email }}
            </div>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="user.displayName"
          label="Display Name"
          outlined
        />
        <v-text-field
          v-model="user.preferences.email"
          :placeholder="user.email"
          label="Preferred Email"
          autocomplete="email"
          outlined
          hide-details
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false">
          Cancel
        </v-btn>
        <primary-btn :loading="loading" @click="updateUser()">
          Save
        </primary-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import UserAvatar from '@/components/users/avatar.vue';

export default {
  components: {
    UserAvatar,
  },
  data() {
    return {
      dialog: false,
      loading: false,
      user: { preferences: {} },
    };
  },
  watch: {
    dialog(to) {
      if (!to) return;
      this.user = this.$user.clone();
      if (!this.user.preferences) {
        this.user.preferences = {};
      }
    },
  },
  methods: {
    async updateUser() {
      this.loading = true;
      try {
        await this.user.save();
        this.user = this.$user.clone();
        this.$success('profile updated');
      } catch (e) {
        this.$handleError(e, 'updating profile');
      }
      this.loading = false;
    },
  },
};
</script>
