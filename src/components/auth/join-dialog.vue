<template>
  <div>
    <global-dialog
      v-model="openDialog"
      @toggle-dialog="toggleDialog"
      :cancelFn="cancelFn"
      :confirmFn="confirmFn"
      titleText="Join Makers?"
      persistent="persistent"
      bodyText="Joining makers will add you to our mailing list
       and allow you to participate in inductions."
    />
    <v-btn @click="unjoin">
      Unjoin
    </v-btn>
  </div>
</template>

<script>
// @ is an alias to /src
import GlobalDialog from '@/components/global/global-dialog.vue';

export default {
  name: 'JoinDialog',
  components: {
    GlobalDialog,
  },
  data: () => ({
    openDialog: false,
  }),
  mounted() {
    this.openDialog = !this.$user?.preferences?.joinedAt;
  },
  methods: {
    toggleDialog(isOpen) {
      this.openDialog = isOpen;
    },
    cancelFn() {
      console.log('cancelling');
      this.$router.push('/logout');
    },
    async unjoin() {
      this.$user.preferences.joinedAt = null;
      await this.$user.save();
    },
    async confirmFn() {
      try {
        this.$user.preferences.joinedAt = new Date();
        this.$user.preferences.rhee = 'yes';
        await this.$user.save();
        this.$success('joined makers');
      } catch (err) {
        this.$handleError('joining makers');
      }
    },
  },
};
</script>
