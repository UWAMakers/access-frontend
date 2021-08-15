<template>
  <v-container>
    <v-form v-model="formValid" lazy-validation @input="$emit('input', form)">
      <v-row>
        <v-subheader>Template details</v-subheader>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-text-field label="Name" v-model="form.name" outlined> </v-text-field
        ></v-col>
        <v-col cols="4">
          <v-autocomplete :items="events" outlined label="Event" v-model="form.action">
          </v-autocomplete>
        </v-col>
        <v-col cols="4" v-show="showTrainings">
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
    </v-form>
  </v-container>
</template>

<script>
const validEmail = (value) => {
  const regex = /.+@.*\.+.*/gm;
  const isValid = value.every((email) => regex.test(email));
  return isValid || 'Valid email require';
};
export default {
  data: () => ({
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
    // 0 - 23
    hoursOfDay: [...Array(24).keys()],
    required: (v) => !!v || 'Required',
    requiredArray: (v) => !!v.length || 'Required',
    validEmail,
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
    onTemplateChange(value) {
      this.compiledMarkdown = value;
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
  components: {},
};
</script>
