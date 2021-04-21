<template>
  <v-card outlined>
    <v-card-title>
      Edit User
    </v-card-title>
    <v-card-text>
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model.trim="user.firstName"
          label="First Name"
          disabled
          outlined
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model.trim="user.lastName"
          label="Last Name"
          disabled
          outlined
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model.trim="user.username"
          label="Username"
          disabled
          outlined
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model.trim="user.email"
          label="Email"
          disabled
          outlined
        />
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="user.roles"
          :items="roles"
          :disabled="!isSuperAdmin"
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
      <v-spacer />
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
    isSuperAdmin() {
      return this.$user.roles.includes('super_admin');
    },
    roles() {
      return [
        { text: 'Admin', value: 'admin' },
        { text: 'Super Admin', value: 'super_admin', disabled: this.$user._id === this.id },
      ];
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
  },
};
</script>
