<template>
  <v-dialog v-model="dialog" max-width="300">
    <template #activator="{ on }">
      <slot name="activator" :on="on">
        <v-btn icon v-on="on">
          <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>
      </slot>
    </template>
    <v-card>
      <v-card-title> Delete {{ name }}? </v-card-title>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false">
          Cancel
        </v-btn>
        <v-btn
          text
          color="error"
          @click="
            dialog = false;
            $emit('delete');
          "
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DeleteDialog',
  props: {
    name: {
      type: String,
      default: 'Item',
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
};
</script>
