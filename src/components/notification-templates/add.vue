<template>
  <v-dialog v-model="dialog" max-width="500">
    <template #activator="{ on }">
      <slot name="activator" :on="on">
        <v-btn icon v-on="on">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </slot>
    </template>
    <v-card>
      <v-card-title> Add New Notification Template </v-card-title>
      <v-form v-model="valid" @submit.prevent="save">
        <v-card-text>
          <v-text-field
            v-model.trim="item.name"
            :rules="rules.name"
            label="Name"
            outlined
            persistent-hint
          />
          <v-textarea
            v-model.trim="item.desc"
            label="Description (optional)"
            outlined
            hide-details
          />
        </v-card-text>
      </v-form>
      <v-card-actions>
        <v-spacer />
        <primary-btn :loading="loading" :disabled="!valid" @click="save"> Create </primary-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      valid: false,
      dialog: false,
      loading: false,
      rules: {
        name: [(v) => !!v || 'Required'],
      },
      item: {
        name: '',
        description: '',
      },
    };
  },
  computed: {},
  methods: {
    async save() {
      const { NotificationTemplates } = this.$FeathersVuex.api;
      // eslint-disable-next-line
      const newTemplate = new NotificationTemplates({
        ...this.item,
      });
      this.loading = true;
      try {
        await newTemplate.save();
        this.$emit('create', this.item);
        this.dialog = false;
        this.$success(`created notification ${this.item.name}`);
        this.loading = false;
      } catch (err) {
        this.$handleError(err, `creating ${this.item.name}`);
      }
      this.loading = false;
    },
  },
};
</script>
