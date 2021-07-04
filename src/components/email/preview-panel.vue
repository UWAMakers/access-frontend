<template>
  <v-container>
    <v-row>
      <v-expansion-panels flat accordion>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div>
              <v-icon left outlined> mdi-help-rhombus </v-icon>
              Email formatting help
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <p>
              Emails are specified as markdown templates (unfortunately we do
              not support Github flavoured markdown) For help writing supported
              markdown, please refer
              <a
                href="https://daringfireball.net/projects/markdown/syntax"
                rel="noopnener noreferrer"
                target="_blank"
                >here</a
              >.
            </p>
            <p>
              A number of magic strings are available to be used which will be
              filled in to the correct value when an email is sent. These magic
              strings are:
            </p>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-left">Magic string</th>
                  <th class="text-left">Explanation</th>
                  <th class="text-left">Example output</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${ recipient.firstName }</td>
                  <td>The email recipient's first name.</td>
                  <td>Fraser</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="6" align="center" justify="center">
        <v-subheader>Template</v-subheader>
      </v-col>
      <v-col cols="6" align="center" justify="center">
        <v-subheader>Template render</v-subheader>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="6">
        <v-textarea v-model="input" filled multiline @input="onChange()">
        </v-textarea>
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
import domPurify from 'dompurify';

export default {
  data: () => ({
    input: '',
  }),
  methods: {
    onChange() {
      // Prevent yucky XSS
      const sanitizedHtml = domPurify.sanitize(marked(this.input));
      this.$emit('input', sanitizedHtml);
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
