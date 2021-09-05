<template>
  <v-row class="pa-4">
    <v-col cols="12">
      <v-card outlined v-if="!!storeConfig">
        <v-card-title>
          Configure Email Template
          <v-spacer></v-spacer>
          <delete-dialog :name="notificationName" @delete="deleteNotification()" />
          <primary-button
            class="mx-2"
            :loading="saveLoading"
            :disabled="!formValid"
            @click="saveNotification"
          >
            Submit
          </primary-button>
        </v-card-title>
        <v-card-subtitle>
          Set up email templates that are sent when events occur within access.
        </v-card-subtitle>
        <v-card-text>
          <v-container>
            <v-row>
              <v-form v-model="formValid">
                <v-row>
                  <v-subheader>Template details</v-subheader>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-text-field label="Name" v-model="form.name" outlined :rules="[required]">
                    </v-text-field
                  ></v-col>
                  <v-col cols="4">
                    <v-autocomplete :items="events" outlined label="Event" v-model="form.action">
                    </v-autocomplete>
                  </v-col>
                  <!-- v-if otherwise form can't be submitted if field hidden -->
                  <v-col cols="4" v-if="showTrainings">
                    <v-autocomplete
                      :items="trainings"
                      :rules="[required]"
                      item-text="name"
                      item-value="_id"
                      outlined
                      label="Training"
                      v-model="form.trainingId"
                    >
                    </v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-text-field
                      label="Subject"
                      v-model="form.subject"
                      outlined
                      :rules="[required]"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-subheader>Email recipient details</v-subheader>
                </v-row>
                <v-row>
                  <v-col>
                    <v-checkbox v-model="form.sendToUser" label="Send a copy to user?">
                    </v-checkbox>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-combobox
                      :label="toFieldDescription"
                      outlined
                      append-icon=""
                      clearable
                      chips
                      hide-no-data
                      deletable-chips
                      :rules="toFieldRules"
                      multiple
                      v-model="form.to"
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
                      v-model="form.cc"
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
                      v-model="form.bcc"
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
                      v-model="sendingPolicy"
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="4" v-if="showSchedule">
                    <v-autocomplete
                      multiple
                      :rules="[requiredArray]"
                      label="Days of the week"
                      :items="daysOfWeek"
                      v-model="form.sendDays"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="4" v-if="showSchedule">
                    <v-autocomplete
                      multiple
                      :rules="[requiredArray]"
                      label="Hours of the day"
                      :items="hoursOfDay"
                      v-model="form.sendHours"
                    >
                    </v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-subheader>Status</v-subheader>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-switch v-model="form.enabled" label="Enabled"></v-switch>
                  </v-col>
                </v-row>
              </v-form>
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
          <primary-button :loading="saveLoading" :disabled="!formValid" @click="saveNotification">
            Submit
          </primary-button>
        </v-card-actions>
      </v-card>
      <v-card outlined v-else>
        <v-card-text>
          No notification template selected, select one to view it's details
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import PrimaryButton from '@/components/global/primary-btn.vue';
import PreviewPanel from '@/components/notification-templates/preview-panel.vue';
import DeleteDialog from '../global/delete-dialog.vue';

const validEmail = (value) => {
  const checkEmail = (email) => {
    const regex = /.+@.*\.+.*/g;
    return regex.test(email);
  };

  const isValid = value.every(checkEmail);
  return isValid || 'Valid email(s) required';
};

export default {
  props: {},
  data: () => ({
    saveLoading: false,
    compiledMarkdown: '',
    bodyForm: {},
    formValid: true,
    sendingPolicy: 'Immediately-ish',
    form: {},
    daysOfWeek: [
      { text: 'Sunday', value: 0 },
      { text: 'Monday', value: 1 },
      { text: 'Tuesday', value: 2 },
      { text: 'Wednesday', value: 3 },
      { text: 'Thursday', value: 4 },
      { text: 'Friday', value: 5 },
      { text: 'Saturday', value: 6 },
    ],
    validEmail,
    // 0 - 23
    hoursOfDay: [...Array(24).keys()],
    required: (v) => !!v || 'Required',
    requiredArray: (v) => !!v.length || 'Required',
    events: [
      'user_joined',
      'training_complete',
      'training_expired',
      'training_change_bulk',
      'template_example',
    ],
    emailSendOptions: ['Immediately-ish', 'On a schedule'],
  }),
  computed: {
    toFieldDescription() {
      const { sendToUser } = this.form;
      return sendToUser ? 'To (optional)' : 'To';
    },
    toFieldRules() {
      const { sendToUser } = this.form;
      return sendToUser ? [this.validEmail] : [this.validEmail, this.requiredArray];
    },
    notificationName() {
      return this.form.name ? this.form.name : 'this item';
    },
    showTrainings() {
      return this.form?.action?.includes('training');
    },
    trainings() {
      const { Training } = this.$FeathersVuex.api;
      const { data } = Training.findInStore({});
      return data;
    },
    showSchedule() {
      return this.sendingPolicy === 'On a schedule';
    },
    id() {
      return this.$route.params?.id;
    },
    storeConfig() {
      const { NotificationTemplates } = this.$FeathersVuex.api;
      const config = NotificationTemplates.getFromStore(this.id);
      return config;
    },
  },
  methods: {
    async saveNotification() {
      try {
        this.saveLoading = true;
        await this.$store.dispatch('notification-templates/patch', [
          this.id,
          { ...this.form, ...this.bodyForm },
        ]);
        this.$success(`edited notification ${this.form.name}`);
        this.saveLoading = false;
      } catch (err) {
        this.$handleError(err, `editing ${this.form.name}`);
        this.saveLoading = false;
      }
    },
    initConfig() {
      this.form = this.storeConfig?.clone() ?? {};
      if (this.form.daysOfWeek?.length && this.form.hoursOfDay?.length) {
        this.sendingPolicy = 'On a schedule';
      } else {
        this.sendingPolicy = 'Immediately-ish';
      }
    },
    async loadTrainings() {
      const { Training } = this.$FeathersVuex.api;
      try {
        await Training.find({
          query: {
            _id: { $nin: this.trainings.map(({ _id }) => _id) },
          },
        });
      } catch (err) {
        this.$handleError(err, 'loading training');
      }
    },
    onTemplateChange(value) {
      this.compiledMarkdown = value;
    },
    async deleteNotification() {
      await this.storeConfig.remove();
      this.$router.push('/email');
    },
  },
  async mounted() {
    this.initConfig();
    await this.loadTrainings();
  },
  watch: {
    'storeConfig._id': {
      handler() {
        this.initConfig();
      },
    },
  },
  components: {
    PrimaryButton,
    PreviewPanel,
    DeleteDialog,
  },
};
</script>
