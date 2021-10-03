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
                  <td v-html="`{{recipient.firstName}}`"></td>
                  <td>The email recipient's first name.</td>
                  <td>Jo</td>
                </tr>
                <tr>
                  <td v-html="`{{recipient.lastName}}`"></td>
                  <td>The email recipient's last name.</td>
                  <td>Bloggs</td>
                </tr>
                <tr>
                  <td v-html="`{{recipient.username}}`"></td>
                  <td>The email recipient's Pheme number.</td>
                  <td>12345678</td>
                </tr>
                <tr>
                  <td v-html="`{{recipient.email}}`"></td>
                  <td>The email recipient's email address.</td>
                  <td>12345678@student.uwa.edu.au</td>
                </tr>
                <tr>
                  <td v-html="`{{recipient.displayName}}`"></td>
                  <td>The email recipient's preferred name</td>
                  <td>J-dawg</td>
                </tr>
                <tr>
                  <td v-html="`{{userNames}}`"></td>
                  <td>A list of the names of the users the email relates to</td>
                  <td>Austin Powers, Nathan Lyon</td>
                </tr>
                <tr>
                  <td v-html="`{{userPhemes}}`"></td>
                  <td>A list of the pheme numbers of the users the email relates to</td>
                  <td>12345678, 87654321</td>
                </tr>
                <tr>
                  <td v-html="`{{{userTable}}}`"></td>
                  <td>A table of the names and pheme numbers of the users the email relates to</td>
                  <td>
                    <v-icon>mdi-alert</v-icon> Make sure you use <span v-html="`{{{`"></span> to
                    delimit this magic string otherwise you'll get raw html
                  </td>
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
    <v-form>
      <v-row justify="center">
        <v-col cols="6">
          <v-textarea v-model="form.body" rounded filled multiline rows="15" @input="onChange">
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
          <v-text-field @input="onChange" v-model="form.buttonText" label="Call to action text">
          </v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.buttonLink" @input="onChange" label="Call to action link">
          </v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import debouncePromise from 'debounce-promise';
import { pick } from 'lodash';

const defaultbuttonText = 'Go to Access';
const defaultbuttonLink = 'http://access.uwamakers.com';

export default {
  data: () => ({
    form: {
      buttonText: defaultbuttonText,
      buttonLink: defaultbuttonLink,
      body: '## Hello World!',
    },
    outputHtml: '',
    loading: false,
  }),
  async mounted() {
    await this.initConfig();
    await this.onChange();
  },
  methods: {
    initConfig() {
      const existingDetails = pick(this.storeConfig?.clone(), ['buttonText', 'buttonLink', 'body']) ?? this.form;
      this.form = existingDetails;
    },
    async onChange() {
      this.loading = true;
      this.$emit('input', this.form);
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
  watch: {
    id() {
      console.log('id changed');
      this.initConfig();
      this.onChange();
    },
  },
  computed: {
    storeConfig() {
      const { NotificationTemplates } = this.$FeathersVuex.api;
      const config = NotificationTemplates.getFromStore(this.id);
      return config;
    },
    id() {
      return this.$route.params?.id;
    },
    outputHtmlSrc() {
      return `data:text/html;base64,${btoa(this.outputHtml)}`;
    },
  },
  components: {},
};
</script>
