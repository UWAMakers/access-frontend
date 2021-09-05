<template>
  <div v-if="$user">
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <span v-on="on" v-bind="attrs">
          <v-badge bottom overlap icon="mdi-chevron-down" color="black">
            <user-avatar :user="$user" size="36" />
          </v-badge>
        </span>
      </template>
      <v-list class="py-0">
        <user-profile>
          <template #activator="{ on }">
            <v-list-item v-on="on">
              <v-list-item-icon>
                <v-icon>mdi-account-edit-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $user.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ $user.username }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </user-profile>
        <v-divider />
        <v-list-item v-if="$isAdmin" to="/training-config">
          <v-list-item-icon>
            <v-icon>mdi-wrench</v-icon>
          </v-list-item-icon>
          <v-list-item-title> Training Config </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="$isAdmin" to="/email">
          <v-list-item-icon>
            <v-icon>mdi-at</v-icon>
          </v-list-item-icon>
          <v-list-item-title> Email management </v-list-item-title>
        </v-list-item>
        <v-divider v-if="$isAdmin" />
        <v-list-item v-if="$isAdmin" to="/user">
          <v-list-item-icon>
            <v-icon>mdi-account-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-title> User Management </v-list-item-title>
        </v-list-item>
        <v-divider v-if="$isAdmin" />
        <v-list-item to="/bug-report">
          <v-list-item-icon>
            <v-icon>mdi-bug</v-icon>
          </v-list-item-icon>
          <v-list-item-title> Report bug </v-list-item-title>
        </v-list-item>
        <v-list-item to="/logout">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title> Logout </v-list-item-title>
        </v-list-item>
        <v-list-item style="min-height: 28px">
          <v-list-item-subtitle>
            <small>
              <version />
            </small>
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import UserAvatar from '@/components/users/avatar.vue';
import UserProfile from '@/components/users/profile.vue';
import Version from '@/components/general/version.vue';

export default {
  components: {
    UserAvatar,
    UserProfile,
    Version,
  },
};
</script>
