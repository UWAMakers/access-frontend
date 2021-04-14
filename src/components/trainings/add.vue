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
      <v-card-title>
        Add New {{title}}
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model.trim="item.name"
          :hint="item.ref"
          label="Name"
          outlined
          persistent-hint
        />
        <v-select
          v-if="service === 'training-items'"
          v-model="item.type"
          :items="types"
          label="Type"
          outlined
        />
        <v-textarea
          v-model.trim="item.desc"
          label="Description (optional)"
          outlined
          hide-details
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <primary-btn
          :loading="loading"
          :disabled="!valid"
          @click="save"
        >
          Create
        </primary-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import slugify from 'slugify';

const slugMeDaddy = (s) => slugify(s || '', { replacement: '-', lower: true, remove: /[^\w- ]/g }).toLowerCase();

export default {
  props: {
    service: {
      type: String,
      default: 'trainings',
    },
  },
  data() {
    return {
      dialog: false,
      loading: false,
      item: {},
      types: [
        { text: 'Comment', value: 'comment' },
        { text: 'Google Quiz', value: 'quiz' },
        { text: 'Other Training', value: 'completion' },
        { text: 'In-Person Induction', value: 'induction' },
      ],
    };
  },
  computed: {
    title() {
      switch (this.service) {
        case 'training-items':
          return 'Training Item';
        default:
          return 'Training Config';
      }
    },
    valid() {
      return !!this.item.name
        && (this.service !== 'training-items' || !!this.item.type);
    },
  },
  watch: {
    'item.name': {
      handler() {
        this.genSlug();
      },
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const { Training, TrainingItem } = this.$FeathersVuex.api;
      switch (this.service) {
        case 'training-items':
          this.item = new TrainingItem({});
          break;
        default:
          this.item = new Training({});
      }
    },
    genSlug() {
      if (this.service !== 'trainings') return;
      if (!this.item.name) this.item.ref = '';
      const { Training } = this.$FeathersVuex.api;
      const slug = slugMeDaddy(this.item.name);
      let current = slug;
      const exists = (ref) => Training.findInStore({ query: { ref } }).total;
      for (let i = 2; exists(current); i += 1) {
        current = `${slug}-${i}`;
      }
      this.item.ref = current;
    },
    async save() {
      this.loading = true;
      try {
        await this.item.save();
        this.$emit('create', this.item);
        this.init();
        this.dialog = false;
      } catch (err) {
        // TODO: render error
        // eslint-disable-next-line no-console
        console.error(err);
      }
      this.loading = false;
    },
  },
};
</script>
