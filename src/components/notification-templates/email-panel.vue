<template>
  <v-card outlined>
    <v-card-title> Configure Email Template </v-card-title>
    <v-card-subtitle>
      Set up email templates that are sent when events occur within access.
    </v-card-subtitle>
    <v-card-text>
      <v-container>
        <v-row>
          <email-form v-model="infoForm" />
        </v-row>
      </v-container>
      <v-row>
        <v-divider class="pa-3"></v-divider>
      </v-row>
      <v-row>
        <preview-panel v-model="bodyForm" />
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
import PreviewPanel from '@/components/notification-templates/preview-panel.vue';
import EmailForm from '@/components/notification-templates/email-form.vue';

export default {
  props: {},
  data: () => ({
    compiledMarkdown: '',
    infoForm: {},
    bodyForm: {},
  }),
  methods: {
    onTemplateChange(value) {
      this.compiledMarkdown = value;
    },
  },
  components: {
    PrimaryButton,
    PreviewPanel,
    EmailForm,
  },
};
</script>
