<template>
  <v-row justify="center" align="center" class="full-height">
    <v-col cols="12" sm="6" class="my-2">
      <confirm-induction v-if="id" :id="id" />
      <give-induction v-else />
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
    id() {
      return this.$route.params?.id;
    },
  },
};
</script>
