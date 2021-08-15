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
              Emails are specified as markdown templates (unfortunately we do not support Github
              flavoured markdown) For help writing supported markdown, please refer
              <a
                href="https://daringfireball.net/projects/markdown/syntax"
                rel="noopnener noreferrer"
                target="_blank"
                >here</a
              >.
            </p>
            <p>
              A number of magic strings are available to be used which will be filled in to the
              correct value when an email is sent. These magic strings are:
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
    <v-form @input="$emit('input', form)">
      <v-row justify="center">
        <v-col cols="6">
          <v-textarea v-model="form.body" rounded filled multiline rows="15" @input="onChange()">
          </v-textarea>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="6">
          <v-progress-linear indeterminate v-show="loading"></v-progress-linear>
          <div style="height: 4px" v-show="!loading"></div>
          <iframe :src="outputHtmlSrc" style="width: 100%; height: 100%" frameBorder="0"> </iframe>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3">
          <v-text-field @input="onChange()" v-model="form.ctaText" label="Call to action text">
          </v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.ctaLink" @input="onChange()" label="Call to action link">
          </v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import debouncePromise from 'debounce-promise';

const defaultCtaText = 'Go to Access';
const defaultCtaLink = 'http://access.uwamakers.com';

export default {
  data: () => ({
    form: {
      body: '',
      ctaText: defaultCtaText,
      ctaLink: defaultCtaLink,
    },
    outputHtml: '',
    loading: false,
  }),
  async mounted() {
    await this.onChange();
  },
  methods: {
    async onChange() {
      this.loading = true;
      await this.loadPreview();
      this.loading = false;
    },
    // eslint-disable-next-line func-names
    loadPreview: debouncePromise(async function () {
      const { NotificationsPreview } = this.$FeathersVuex.api;
      const newNotificationsPreview = new NotificationsPreview({
        ...this.form,
      });
      try {
        this.loading = true;
        const { emailHtml } = await newNotificationsPreview.save();
        this.outputHtml = emailHtml;
      } catch (err) {
        this.error = 'There was an error rendering the template';
      }
      this.loading = false;
    }, 200),
  },
  computed: {
    outputHtmlSrc() {
      return `data:text/html;base64,${btoa(this.outputHtml)}`;
    },
  },
  components: {},
};
</script>
