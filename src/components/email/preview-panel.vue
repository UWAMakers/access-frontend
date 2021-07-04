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
        <v-textarea
          v-model="input"
          rounded
          filled
          multiline
          rows="15"
          @input="onChange()"
        >
        </v-textarea>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col cols="6">
        <div v-html="outputHtml" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3">
        <v-text-field
          @input="onChange()"
          v-model="ctaText"
          label="Call to action text"
        >
        </v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field
          v-model="ctaLink"
          @input="onChange()"
          label="Call to action link"
        >
        </v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import marked from 'marked';
import domPurify from 'dompurify';
import createTemplate from './templates/standard';

const defaultCtaText = 'Go to Access';
const defaultCtaLink = 'http://access.uwamakers.com';

export default {
  data: () => ({
    input: '',
    ctaText: defaultCtaText,
    ctaLink: defaultCtaLink,
    outputHtml: createTemplate('', defaultCtaText, defaultCtaLink),
  }),
  methods: {
    onChange() {
      // Prevent yucky XSS
      const sanitizedHtml = domPurify.sanitize(marked(this.input));
      console.log(this.ctaText);
      this.outputHtml = createTemplate(sanitizedHtml, this.ctaText, this.ctaLink);
      this.$emit('input', this.outputHtml);
    },
  },
  computed: {
  },
  components: {},
};
</script>
