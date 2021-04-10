<template>
  <v-app-bar app color="secondary" dark>
    <div>
      <router-link to="/" class="ml-1">
        <v-btn color="accent" text> Home</v-btn>
      </router-link>
      <router-link to="/training" class="ml-1">
        <v-btn color="accent" text> Training</v-btn>
      </router-link>
      <router-link to="/cards" class="ml-1">
        <v-btn color="accent" text> Cards</v-btn>
      </router-link>
    </div>
    <v-spacer></v-spacer>
    <div>
      <DarkModeIcon />
    </div>
    <div>
      <AvatarMenu />
    </div>
  </v-app-bar>
</template>

<script>
import DarkModeIcon from './DarkModeIcon.vue';
import AvatarMenu from './AvatarMenu.vue';

export default {
  name: 'Nav',
  components: {
    DarkModeIcon,
    AvatarMenu,
  },
  data: () => ({}),
  methods: {},
};
</script>
