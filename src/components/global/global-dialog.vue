<template>
  <v-dialog
    :value="value"
    max-width="300"
    persistent="persistent"
    @input="$emit('toggle-dialog', !value)"
  >
    <v-card>
      <v-card-title> {{ titleText }} </v-card-title>
      <v-card-text>{{ bodyText }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="handleCancel">
          Cancel
        </v-btn>
        <v-btn text @click="handleConfirm">
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Dialog',
  props: {
    confirmFn: {
      type: Function,
      default: null,
    },
    cancelFn: {
      type: Function,
      default: null,
    },
    titleText: {
      type: String,
      default: '',
    },
    bodyText: {
      type: String,
      default: '',
    },
    value: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'primary',
    },
    persistent: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleConfirm() {
      if (this.confirmFn) {
        this.confirmFn();
      }
      this.$emit('toggle-dialog', !this.value);
    },
    handleCancel() {
      if (this.cancelFn) {
        this.cancelFn();
      }
      this.$emit('toggle-dialog', !this.value);
    },
  },
};
</script>
