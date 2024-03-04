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
        <v-alert
          v-if="user.preferences.email !== user.preferredEmail"
          type="warning"
          class="mt-4"
        >
          Changing your preferred email will require you to verify it.
        </v-alert>
        <v-alert
          v-if="$user.preferences.email !== $user.preferredEmail"
          type="warning"
          class="mt-4"
        >
          Your current preferred email is not yet verified.
        </v-alert>
        <v-divider class="my-4" />
        <div
          class="d-flex align-center"
          v-for="login in socialLogins"
          :key="login.ref"
        >
          <v-btn
            :color="login.color"
            :dark="!hasLogin(login) ? login.isDark : undefined"
            :disabled="loading || hasLogin(login)"
            class="flex-grow-1"
            depressed
            :href="getLoginUrl(login)"

          >
            <simple-icon :icon="login.icon" :color="login.isDark ? 'white' : 'black'" left />
            <span v-if="!hasLogin(login)">Link your {{ login.name }}</span>
            <span v-else>{{ login.name }} is linked</span>
          </v-btn>
          <delete-dialog
            v-if="hasLogin(login)"
            :name="`${login.name} Link`"
            @delete="unlinkLogin(login)"
          >
            <template #activator="{ on: onDialog }">
              <v-tooltip top>
                <template #activator="{ on: onTooltip }">
                  <v-btn
                    :disabled="loading"
                    class="ml-2"
                    icon
                    small
                    v-on="{ ...onDialog, ...onTooltip }"
                  >
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>
                </template>
                <span>Unlink {{ login.name }}</span>
              </v-tooltip>
            </template>
          </delete-dialog>
        </div>
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
import socialLogins from '@/util/social-logins';

export default {
  components: {
    UserAvatar,
  },
  data() {
    return {
      dialog: false,
      loading: false,
      user: { preferences: {} },
      socialLogins,
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
    hasLogin(login) {
      const key = `${login.ref}Id`;
      return !!this.$user[key];
    },
    getLoginUrl(login) {
      const jwt = encodeURIComponent(this.$store.state.auth.accessToken);
      const redirect = encodeURIComponent(`/?link_success=${login.ref}`);
      return `${process.env.VUE_APP_API_URL}/oauth/${login.ref}?redirect=${redirect}&feathers_token=${jwt}`;
    },
    async unlinkLogin(login) {
      const { User } = this.$FeathersVuex.api;
      this.loading = true;
      await this.$try(`unlinking ${login.name}`, async () => {
        await User.unlinkSocialLogin(login.ref);
      });
      this.loading = false;
    },
  },
};
</script>
