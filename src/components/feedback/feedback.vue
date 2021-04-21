<template>
  <v-card outlined>
    <v-card-title>
      Report a bug
    </v-card-title>
    <v-card-text>
      Please try to describe the problem as clearly as possible. We will be in touch for
      further details if required.
      <v-textarea
        v-model="msg"
        label="Description"
        class="mt-4"
        counter
        outlined
        auto-grow
      />
    </v-card-text>
    <v-card-actions>
      <primary-button v-show="showErrorTest" @click="testError">Brew Coffee</primary-button>
      <v-spacer />
      <primary-button
        :loading="loading"
        :disabled="!msg"
        @click="submit"
      >
        Submit
      </primary-button>
    </v-card-actions>
  </v-card>
</template>

<script>
import PrimaryButton from '@/components/global/primary-btn.vue';
import { mapMutations } from 'vuex';

export default {
  data: () => ({
    msg: '',
    loading: false,
  }),
  computed: {
    showErrorTest() {
      return process.env.NODE_ENV !== 'production';
    },
  },
  methods: {
    ...mapMutations(['showSnackbar', 'closeSnackbar']),
    async submit() {
      this.loading = true;
      const { Feedback } = this.$FeathersVuex.api;
      const newFeedback = new Feedback({
        msg: this.msg,
      });
      try {
        await newFeedback.save();
        this.msg = '';
        this.$success('sent feedback');
      } catch (err) {
        this.$handleError(err, 'sending feedback');
      }
      this.loading = false;
    },
    testError() {
      this.$handleError(new Error('418 I\'m a Teapot'), 'brewing coffee');
    },
  },
  components: {
    PrimaryButton,
  },
};
</script>
