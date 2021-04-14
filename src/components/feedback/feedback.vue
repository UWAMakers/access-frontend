<template>
  <v-container fill-height fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="6" class="my-2">
        <v-card>
          <v-card-title>
            Report a bug
          </v-card-title>
          <v-card-text>
            Please try to describe the problem as clearly as possible. We will be in touch for
            further details if required.
            <v-textarea counter label="Description" class="my-2" v-model="msg"></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <primary-button :loading="loading" @click="submit">Submit</primary-button>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PrimaryButton from '@/components/global/primary-btn.vue';
import { mapMutations } from 'vuex';

export default {
  data: () => ({
    msg: '',
    loading: false,
  }),
  mounted() {},
  methods: {
    ...mapMutations(['showSnackbar', 'closeSnackbar']),
    async submit() {
      this.loading = true;
      const { Feedback } = this.$FeathersVuex.api;
      const newFeedback = new Feedback({
        msg: this.msg,
      });
      await newFeedback.save();
      this.msg = '';
      this.loading = false;
      this.showSnackbar({
        text: 'Feedback received!',
        severity: 'success',
        visible: true,
      });
    },
  },
  components: {
    PrimaryButton,
  },
};
</script>
