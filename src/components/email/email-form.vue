<template>
  <v-container>
    <v-form v-model="form.valid" lazy-validation @input="$emit('input', form)">
      <v-row>
        <v-subheader>Template details</v-subheader>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-text-field label="Name" v-model="form.name" outlined>
          </v-text-field
        ></v-col>
        <v-col cols="4">
          <v-autocomplete
            :items="events"
            outlined
            label="Event"
            v-model="form.event"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="4"> </v-col>
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
            v-model="form.sendPolicy"
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
    form: {
      valid: true,
      cc: [],
      to: [],
      bcc: [],
      name: '',
      event: '',
      sendPolicy: '',
      sendDays: [],
      sendHours: [],
    },
    daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    // 0 - 23
    hoursOfDay: [...Array(24).keys()],
    required: (v) => !!v || 'Required',
    requiredArray: (v) => !!v.length || 'Required',
    validEmail,
    events: ['Fraser wakes up before midday', 'Eddie understands React'],
    emailSendOptions: ['Immediately-ish', 'On a schedule'],
  }),
  computed: {
    showSchedule() {
      return this.form.sendPolicy === 'On a schedule';
    },
  },
  methods: {
    onTemplateChange(value) {
      this.compiledMarkdown = value;
    },
  },
  components: {
  },
};
</script>
