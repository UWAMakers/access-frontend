<template>
  <v-app-bar app color="secondary" dark clipped-left class="elevation-1">
    <img alt="UWA Makers" src="/icon.png" class="mx-1" style="height: 36px; width: 36px" />
    <div>
      <v-btn to="/" color="accent" text class="mx-1">Home</v-btn>
      <v-btn to="/training" color="accent" text class="mx-1">Training</v-btn>
      <v-btn to="/cards" color="accent" text class="mx-1">Cards</v-btn>
    </div>
    <v-spacer></v-spacer>
    <div>
      <dark-mode-icon />
    </div>
    <div>
      <avatar-menu />
    </div>
    <join-dialog />
  </v-app-bar>
</template>

<script>
import JoinDialog from '@/components/auth/join-dialog.vue';
import DarkModeIcon from './dark-mode-icon.vue';
import AvatarMenu from './avatar-menu.vue';

export default {
  components: {
    DarkModeIcon,
    AvatarMenu,
    JoinDialog,
  },
  data: () => ({}),
  methods: {},
};
</script>
