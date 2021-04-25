<template>
  <v-card outlined>
    <v-card-title>
      Confirm Induction Completion
    </v-card-title>
    <v-card-text>
      I acknowledge receipt of this health and safety induction
      and have received the necessary information, instruction and training
      required to enable me to work safely.
    </v-card-text>
      <v-card-actions>
      <v-spacer />
      <v-btn text to="/">
        Cancel
      </v-btn>
      <primary-btn @click="confirm">
        I Agree
      </primary-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    inductionKey: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async confirm() {
      if (!this.inductionKey) return;
      const { Induction } = this.$FeathersVuex.api;
      this.loading = true;
      try {
        const { trainingId } = await Induction.get(this.inductionKey);
        this.$success('completed induction');
        this.$router.replace(trainingId ? `/training/${trainingId}` : '/');
      } catch (err) {
        this.$handleError(err, 'confirming induction');
      }
      this.loading = false;
    },
  },
};
</script>
