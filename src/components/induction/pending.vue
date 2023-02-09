<template>
  <div class="d-flex justify-center">
  <v-card v-if="pendings.length" outlined>
    <v-card-title>Pending Inductions</v-card-title>
    <v-card-text>
      <p>
        You have inductions pending confirmation,
        please confirm them before they expire:
      </p>
      <v-list>
        <v-list-item
          v-for="(pending, i) in pendings"
          :key="i"
          :to="`/induction/${pending.key}`"
        >
          <v-list-item-content>
            <v-list-item-title>
              <strong>{{ pending.trainingName }}</strong>
              &mdash;
              {{ pending.trainingItemName }}
            </v-list-item-title>
            <v-list-item-subtitle>
              Inducted by {{ pending.inductorName }}
              on {{ formatDateTime(pending.createdAt) }}
            </v-list-item-subtitle>
            <v-list-item-subtitle :class="expireColor(pending.expiresAt)">
              Confirmation expires {{ formatFromNow(pending.expiresAt) }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <primary-btn :to="`/induction/${pending.key}`">
              Confirm
            </primary-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</div>
</template>

<script>
import dayjs from 'dayjs';
import primaryBtn from '../global/primary-btn.vue';

export default {
  components: { primaryBtn },
  data() {
    return {
      pendings: [],
    };
  },
  mounted() {
    this.loadPending();
  },
  methods: {
    loadPending() {
      const { InductionPending } = this.$FeathersVuex.api;
      this.$try('loading pending inductions', async () => {
        const { data } = await InductionPending.find();
        this.pendings = data;
      });
    },
    formatDateTime(date) {
      return dayjs(date).format('Do MMMM, YYYY [at] HH:mm');
    },
    formatFromNow(date) {
      return dayjs(date).fromNow();
    },
    expireColor(expiresAt) {
      const now = dayjs();
      const expires = dayjs(expiresAt);
      if (now.isAfter(expires.subtract(1, 'day'))) {
        return 'error--text';
      }
      if (now.isAfter(expires.subtract(2, 'day'))) {
        return 'warning--text';
      }
      return '';
    },
  },
};
</script>

<style scoped>
.v-card {
  margin-bottom: 1rem;
  max-width: 600px;
}
</style>
