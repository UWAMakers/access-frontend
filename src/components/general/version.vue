<template>
  <span>
    APP-{{ frontendVersion }}
    &mdash;
    API-{{ backendVersion }}
  </span>
</template>

<script>
export default {
  data() {
    return {
      frontendVersion: process.env.VUE_APP_GIT_HASH,
      backendVersion: '',
    };
  },
  async created() {
    await this.getBackendVersion();
  },
  methods: {
    async getBackendVersion() {
      try {
        const url = `${process.env.VUE_APP_API_URL.replace(/\/$/, '')}/version`;
        const { gitHash } = await fetch(url).then((res) => res.json());
        this.backendVersion = gitHash;
      } catch (e) {
        this.backendVersion = 'unknown';
      }
    },
  },
};
</script>

<style scoped>
span {
  font-family: monospace;
}
</style>
