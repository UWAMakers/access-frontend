<template>
  <v-app-bar
    v-if="$user && $user._id && !$route.meta.isPublic"
    app
    :color="!$vuetify.theme.dark ? 'secondary' : undefined"
    clipped-left
    class="elevation-1"
  >
    <img
      alt="UWA Makers"
      src="/icon.png"
      class="mx-1"
      style="height: 36px; width: 36px"
    />
    <div v-show="$vuetify.breakpoint.mdAndUp">
      <v-btn to="/" :color="btnColor" text class="mx-1">Home</v-btn>
      <v-btn to="/training" :color="btnColor" text class="mx-1">Training</v-btn>
      <!-- <v-btn to="/card" :color="btnColor" text class="mx-1">Cards</v-btn> -->
      <v-btn
        v-show="showInduction"
        to="/induction"
        :color="btnColor"
        text
        class="mx-1"
      >
        Induct
      </v-btn>
    </div>
    <div v-show="!$vuetify.breakpoint.mdAndUp">
      <v-menu close-on-content-click>
        <template #activator="{ on }">
          <v-btn :color="btnColor" text class="mx-1" v-on="on">
            {{$route.name}}
            <v-icon right>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list class="py-0">
          <v-list-item to="/">
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>
          <v-list-item to="/training">
            <v-list-item-title>Training</v-list-item-title>
          </v-list-item>
          <!-- <v-list-item to="/cards">
            <v-list-item-title>Cards</v-list-item-title>
          </v-list-item> -->
          <v-list-item v-show="showInduction" to="/induction">
            <v-list-item-title>Induct</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
  computed: {
    btnColor() {
      return this.$vuetify.theme.dark ? 'white' : 'accent';
    },
    showInduction() {
      if (!this.$user?._id) return false;
      const { TrainingItem } = this.$FeathersVuex.api;
      const { total } = TrainingItem.findInStore({
        query: {
          type: 'induction',
          inductorIds: this.$user._id,
        },
      });
      return this.$isAdmin || !!total;
    },
  },
  async mounted() {
    await this.loadInductionVisibility();
  },
  methods: {
    async loadInductionVisibility() {
      if (!this.$user?._id) return;
      const { TrainingItem } = this.$FeathersVuex.api;
      try {
        await TrainingItem.find({
          query: {
            type: 'induction',
            inductorIds: this.$user._id,
          },
        });
      } catch (err) {
        this.$handleError(err, 'initialising the menu');
      }
    },
  },
};
</script>
