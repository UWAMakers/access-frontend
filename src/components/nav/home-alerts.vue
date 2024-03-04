<template>
  <v-row align="center" class="flex-column">
    <v-col v-if="successLink" cols="12" md="8" lg="6">
      <v-alert
        type="success"
        border="top"
        text
        dismissible
        @input="!$event && clearSuccessLink()"
      >
        {{ successLink.name }} was linked successfully!
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
import socialLogins from '@/util/social-logins';

export default {
  computed: {
    successLink() {
      const ref = this.$route.query.link_success;
      if (!ref) return null;
      return socialLogins.find((l) => l.ref === ref);
    },
  },
  mounted() {
    if (this.successLink) {
      window.location.hash = '';
    }
  },
  methods: {
    clearSuccessLink() {
      this.$router.replace({ query: { ...this.$route.query, link_success: undefined } });
    },
  },
};
</script>
