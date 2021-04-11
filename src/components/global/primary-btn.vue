<template>
  <v-btn
    :class="{
      'white--text': !$vuetify.theme.dark,
      'black--text': $vuetify.theme.dark,
    }"
    color="primary"
    depressed
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </v-btn>
</template>

<script>
export default {
  name: 'PrimaryBtn',
};
</script>
