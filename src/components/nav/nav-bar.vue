<template>
  <v-app-bar app color="secondary" dark clipped-left class="elevation-1">
    <img
      alt="UWA Makers"
      src="/icon.png"
      class="mx-1"
      style="height: 36px; width: 36px"
    />
    <div>
      <v-btn to="/" :color="btnColor" text class="mx-1">Home</v-btn>
      <v-btn to="/training" :color="btnColor" text class="mx-1">Training</v-btn>
      <v-btn to="/cards" :color="btnColor" text class="mx-1">Cards</v-btn>
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
  data() {
    return {
      showInduction: false,
    };
  },
  computed: {
    btnColor() {
      return this.$vuetify.theme.dark ? 'white' : 'accent';
    },
  },
  async mounted() {
    await this.loadInductionVisibility();
  },
  methods: {
    async loadInductionVisibility() {
      const { TrainingItem } = this.$FeathersVuex.api;
      if (this.$isAdmin) {
        this.showInduction = true;
        return;
      }
      try {
        const { total } = await TrainingItem.find({
          query: {
            type: 'induction',
            inductorIds: this.$user._id,
            $limit: 0,
          },
        });
        this.showInduction = !!total;
      } catch (err) {
        this.$handleError(err, 'initialising the menu');
      }
    },
  },
};
</script>
