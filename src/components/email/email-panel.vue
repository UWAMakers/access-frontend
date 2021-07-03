<template>
  <v-card outlined>
    <v-card-title> Configure Email Template </v-card-title>
    <v-card-subtitle>
      Set up email templates that are sent when events occur within access.
    </v-card-subtitle>
    <v-card-text>
      <v-container>
        <v-row>
          <v-subheader>Template details</v-subheader>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field label="Name" v-model="name" outlined> </v-text-field
          ></v-col>
          <v-col cols="4">
            <v-autocomplete :items="events" outlined label="Event">
            </v-autocomplete>
          </v-col>
          <v-col cols="4"> </v-col>
        </v-row>
        <v-form v-model="valid" lazy-validation>
          <v-row>
            <v-subheader>Email recipient details</v-subheader>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-combobox
                label="To"
                outlined
                append-icon=""
                clearable
                chips
                hide-no-data
                deletable-chips
                :rules="[this.requiredArray, this.validEmail]"
                multiple
                v-model="to"
              ></v-combobox>
            </v-col>
            <v-col cols="4">
              <v-combobox
                label="CC"
                append-icon=""
                clearable
                outlined
                chips
                hide-no-data
                deletable-chips
                :rules="[this.validEmail]"
                multiple
                v-model="cc"
              ></v-combobox>
            </v-col>
            <v-col cols="4">
              <v-combobox
                label="BCC"
                append-icon=""
                clearable
                outlined
                chips
                hide-no-data
                deletable-chips
                :rules="[this.validEmail]"
                multiple
                v-model="bcc"
              ></v-combobox>
            </v-col>
          </v-row>
          <v-row>
            <v-subheader>Sending schedule</v-subheader>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-select
                :rules="[required]"
                label="Send email..."
                :items="emailSendOptions"
              >
              </v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
      <v-row>
        <v-divider class="pa-3"></v-divider>
      </v-row>
      <v-row>
        <preview-panel v-model="compiledMarkdown" />
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <primary-button> Submit </primary-button>
    </v-card-actions>
  </v-card>
</template>

<script>
import PrimaryButton from '@/components/global/primary-btn.vue';
import PreviewPanel from '@/components/email/preview-panel.vue';

const validEmail = (value) => {
  const regex = /.+@.*\.+.*/gm;
  const isValid = value.every((email) => regex.test(email));
  return isValid || 'Valid email require';
};
export default {
  data: () => ({
    valid: true,
    required: (v) => !!v || 'Required',
    requiredArray: (v) => !!v.length || 'Required',
    validEmail,
    compiledMarkdown: '',
    cc: [],
    to: [],
    bcc: [],
    name: '',
    events: ['Fraser wakes up before midday', 'Eddie understands React'],
    emailSendOptions: ['Immediately-ish', 'Every'],
  }),
  methods: {
    onTemplateChange(value) {
      this.compiledMarkdown = value;
    },
  },
  components: {
    PrimaryButton,
    PreviewPanel,
  },
};
</script>
