<template>
  <v-card outlined>
    <v-card-title>
      Edit {{user.name}}
      <v-spacer />
    </v-card-title>
    <v-card-text>
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model.trim="user.firstName"
          label="First Name"
          outlined
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model.trim="user.lastName"
          label="Last Name"
          outlined
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model.trim="user.username"
          :disabled="!$isSuperAdmin"
          label="Username"
          outlined
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model.trim="user.email"
          :disabled="!$isSuperAdmin"
          label="Email"
          outlined
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model.trim="user.preferredEmail"
          label="Preferred Email"
          outlined
        />
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="user.roles"
          :items="roles"
          :disabled="!$isSuperAdmin"
          label="Roles"
          multiple
          outlined
          chips
          deletable-chips
          small-chips
          dense
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model.trim="user.displayName"
          label="Display Name"
          outlined
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-switch
          v-model.trim="user.preferences.dark"
          label="Dark Mode"
        />
      </v-col>
    </v-row>
    </v-card-text>
    <v-card-actions>
      <div class="joined-at pl-2">
        Joined on: {{ joinedAt }}
      </div>
      <v-spacer />
      <delete-dialog v-if="$isSuperAdmin" :name="user.name" @delete="removeUser">
        <template #activator="{ on }">
          <v-btn :loading="loading" color="error" text v-on="on">
            Delete
          </v-btn>
        </template>
      </delete-dialog>
      <primary-btn
        :loading="loading"
        @click="saveUser"
      >
        Save
      </primary-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import dayjs from 'dayjs';

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      user: { preferences: {} },
      loading: true,
    };
  },
  computed: {
    roles() {
      return [
        { text: 'Admin', value: 'admin' },
        { text: 'Super Admin', value: 'super_admin', disabled: this.$user?._id === this.id },
      ];
    },
    joinedAt() {
      if (!this.user?.preferences?.joinedAt) return 'Not a Member';
      return dayjs(this.user.preferences.joinedAt).format('Do MMM, YYYY [@] h:mm A');
    },
  },
  async mounted() {
    await this.loadUser();
  },
  watch: {
    async id(to, from) {
      if (to === from) return;
      await this.loadUser();
    },
  },
  methods: {
    async loadUser() {
      const { User } = this.$FeathersVuex.api;
      let user;
      this.loading = true;
      try {
        user = User.getFromStore(this.id);
        if (!user) user = await User.get(this.id);
        this.user = user.clone();
      } catch (err) {
        this.$handleError(err, 'loading user');
      }
      this.loading = false;
    },
    async saveUser() {
      this.loading = true;
      try {
        await this.user.save();
        this.$success('saved user');
        await this.loadUser();
      } catch (err) {
        this.$handleError(err, 'saving user');
      }
      this.loading = false;
    },
    async removeUser() {
      this.loading = true;
      await this.$try('deleting user', async () => {
        await this.user.remove();
        this.$router.push('/user');
      }, { success: true });
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.joined-at {
  font-size: 0.8rem;
}
</style>
