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
      this.$store.dispatch('auth/logout').then(() => {
        this.$router.push('/login');
      });
    },
    async confirmFn() {
      try {
        this.$user.preferences.joinedAt = new Date();
        await this.$user.save();
        this.$success('joined makers');
      } catch (err) {
        this.$handleError('joining makers');
      }
    },
  },
};
</script>
