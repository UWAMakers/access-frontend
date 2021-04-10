<template>
  <div>
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-on="on" v-bind="attrs">
          <v-avatar color="primary" size="36">
            <span :class="!$vuetify.theme.dark ? 'white--text' : 'black--text'">
              {{ initials }}
            </span>
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-account-circle</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{$user.firstName}} {{$user.lastName}}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{$user.username}}
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
export default {
  data: () => ({}),
  computed: {
    initials() {
      return this.$user.firstName.charAt(0) + this.$user.lastName.charAt(0);
    },
    isAdmin() {
      return this.$user.roles.includes('admin');
    },
  },
};
</script>
