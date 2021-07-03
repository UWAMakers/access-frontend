<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="6" align="center" justify="center">
        <p>Template</p>
      </v-col>
      <v-col cols="6" align="center" justify="center">
        <p>Render</p>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="6">
        <v-textarea v-model="input" filled multiline @input="onChange()"> </v-textarea>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col>
        <div v-html="compiledMarkdown" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import marked from 'marked';

export default {
  data: () => ({
    input: '',
  }),
  methods: {
    onChange() {
      this.$emit('input', marked(this.input));
    },
  },
  computed: {
    compiledMarkdown() {
      return marked(this.input);
    },
  },
  components: {},
};
</script>
