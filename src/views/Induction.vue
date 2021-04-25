<template>
  <v-row justify="center" align="center" class="full-height px-3">
    <v-col v-if="inductionKey" cols="12" sm="6" md="4" lg="3" class="my-2">
      <confirm-induction :induction-key="inductionKey" />
    </v-col>
    <v-col v-else cols="12" sm="8" md="6" lg="4" class="my-2">
      <give-induction />
    </v-col>
  </v-row>
</template>

<script>
import GiveInduction from '@/components/induction/give.vue';
import ConfirmInduction from '@/components/induction/confirm.vue';

export default {
  components: {
    GiveInduction,
    ConfirmInduction,
  },
  computed: {
    inductionKey() {
      return this.$route.params?.key;
    },
  },
};
</script>
