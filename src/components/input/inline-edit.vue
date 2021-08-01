<template>
  <div :class="{ 'pt-1': !editing, 'mb-1': !editing }">
    <span v-if="!editing" @click="editing = true">
      {{value}}
      <v-btn small icon class="ml-4">
        <v-icon small>mdi-pencil</v-icon>
      </v-btn>
    </span>
    <v-text-field
      v-else
      v-bind="$attrs"
      v-model="inputValue"
      append-outer-icon="mdi-check-circle-outline"
      style="max-width: 256px;"
      autofocus
      dense
      hide-details
      @blur="reset"
      @keypress.enter="$emit('input', inputValue); reset();"
      @click:append-outer.prevent="$emit('input', inputValue); reset();"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      editing: false,
      inputValue: this.value,
    };
  },
  watch: {
    value(value) {
      this.inputValue = value;
    },
  },
  methods: {
    reset() {
      this.editing = false;
      this.inputValue = this.value;
    },
  },
};
</script>

<style>

</style>
