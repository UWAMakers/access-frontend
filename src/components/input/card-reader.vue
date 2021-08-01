<template>
  <div v-show="method">
    <slot name="activator" :on="{ click: startScan }">
      <primary-btn @click="startScan">{{label}}</primary-btn>
    </slot>
    <v-dialog :value="value" max-width="300" @input="$emit('input', $event)">
      <v-card>
      <v-card-title>
        <v-icon left large>mdi-card-account-details-outline</v-icon>
        {{label}}
      </v-card-title>
      <v-card-text v-show="errMsg">
        <v-alert type="error">{{errMsg}}</v-alert>
      </v-card-text>
      <v-card-text v-show="method === 'NDEFReader'">
        <strong>You may need to give this app permission to access your NFC reader.</strong>
        <p>
          Scan your card on the back of your device.
        </p>
        <v-row justify="center">
          <v-col cols="auto">
            <v-icon x-large>mdi-cellphone-nfc</v-icon>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text v-show="method === 'labScanner'">
        You have
        <strong>{{secondsLeft}} second{{secondsLeft !== 1 ? 's' : ''}}</strong>
        to scan your card on a scanner in the lab.
        <v-row justify="center">
          <v-col cols="auto">
            <v-icon x-large>mdi-credit-card-wireless</v-icon>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn depressed @click="$emit('input', false)">
          Cancel Scan
        </v-btn>
        <v-spacer />
      </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Scan Card',
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      method: null,
      secondsLeft: 10,
      ndef: null,
      errMsg: '',
    };
  },
  async mounted() {
    if ('NDEFReader' in window) {
      this.method = 'NDEFReader';
      return;
    }
    const ip = await fetch('https://api.ipify.org').then((res) => res.text());
    if (ip && ip.indexOf('130.95.') === 0) {
      this.method = 'labScanner';
    }
  },
  watch: {
    value() {
      if (!this.value) {
        this.stopScan();
      }
    },
  },
  beforeDestroy() {
    this.stopScan();
  },
  methods: {
    startScan() {
      this.errMsg = '';
      this.secondsLeft = 10;
      if (this.method === 'NDEFReader') {
        this.startDeviceScan();
      }
    },
    stopScan() {
      if (this.method === 'NDEFReader') {
        this.stopDeviceScan();
      }
    },
    onRead({ serialNumber }) {
      this.errMsg = '';
      this.$emit('scan', serialNumber.split(':').map((v) => Number.parseInt(v, 16)));
      this.$emit('input', false);
    },
    onError() {
      this.errMsg = 'Error reading card, try scanning again.';
    },
    async startDeviceScan() {
      try {
        if (!this.ndef) this.ndef = new window.NDEFReader();
        this.ctlr = new AbortController();
        this.ndef.addEventListener('reading', this.onRead);
        this.ndef.addEventListener('readingerror', this.onError);
        await this.ndef.scan({ signal: this.ctlr.signal });
        this.$emit('input', true);
      } catch (err) {
        console.error(err);
        this.errMsg = err.message;
      }
    },
    stopDeviceScan() {
      if (this.ndef) {
        this.ndef.removeEventListener('reading', this.onRead);
        this.ndef.removeEventListener('readingerror', this.onError);
      }
      if (this.ctlr) {
        this.ctlr.abort();
      }
    },
  },
};
</script>
