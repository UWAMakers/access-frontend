<template>
  <div v-if="$user">
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <user-avatar :user="$user" size="36" v-on="on" v-bind="attrs" />
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-account-circle</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> {{ $user.name }} </v-list-item-title>
            <v-list-item-subtitle>
              {{ $user.username }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item v-if="isAdmin" to="/training-config">
          <v-list-item-icon>
            <v-icon>mdi-wrench</v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            Training Config
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isAdmin" to="/users">
          <v-list-item-icon>
            <v-icon>mdi-account-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            User Management
          </v-list-item-title>
        </v-list-item>
        <v-divider v-if="isAdmin" />
        <v-list-item to="/bug-report">
          <v-list-item-icon>
            <v-icon>mdi-bug</v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            Report bug
          </v-list-item-title>
        </v-list-item>
        <v-list-item to="/logout">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            Logout
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import UserAvatar from '@/components/users/avatar.vue';

export default {
  components: {
    UserAvatar,
  },
  computed: {
    isAdmin() {
      return this.$user.roles.includes('admin') || this.$user.roles.includes('super_admin');
    },
  },
};
</script>
