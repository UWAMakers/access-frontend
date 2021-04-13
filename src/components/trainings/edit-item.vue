<template>
  <v-row align="center">
    <v-col cols="12" class="pb-0">
      <v-text-field
        v-model.trim="item.name"
        label="Name"
        outlined
        dense
      />
    </v-col>
    <v-col cols="12" class="py-0">
      <v-textarea
        v-model.trim="item.desc"
        label="Description"
        rows="1"
        auto-grow
        outlined
        dense
      />
    </v-col>
    <v-col cols="12" class="py-0">
      <v-text-field
        v-show="visibleFields.includes('url')"
        v-model.trim="item.url"
        :label="item.type === 'quiz' ? 'Quiz URL' : 'URL'"
        outlined
        dense
      />
    </v-col>
    <v-col cols="12" class="py-0">
      <v-text-field
        v-show="visibleFields.includes('csvUrl')"
        v-model.trim="item.csvUrl"
        label="CSV URL"
        outlined
        dense
      />
    </v-col>
    <v-col cols="12" class="py-0">
      <v-autocomplete
        v-show="visibleFields.includes('trainingId')"
        v-model="item.trainingId"
        :items="trainings"
        label="Training"
        item-text="name"
        item-value="_id"
        outlined
        dense
      />
    </v-col>
    <v-col cols="6" class="py-0">
      <v-text-field
        v-show="visibleFields.includes('expiry')"
        v-model.number="item.expiry"
        label="Expiry (weeks)"
        hint="Zero/Blank means never expires"
        type="number"
        step="1"
        min="0"
        outlined
        dense
      />
    </v-col>
    <v-col cols="6" class="py-0">
      <v-text-field
        v-show="visibleFields.includes('requiredScore')"
        :value="item.requiredScore * 100"
        v-model.number="item.requiredScore"
        label="Required Quiz Score"
        hint="Percentage (0-100%)"
        type="number"
        step="1"
        min="0"
        max="100"
        outlined
        dense
        @input="$set(item, 'requiredScore', $event / 100)"
      />
    </v-col>
    <v-col cols="auto" class="py-0">
      <v-checkbox
        v-show="visibleFields.includes('required')"
        v-model="item.required"
        label="Is Required"
        class="mt-0"
        outlined
        dense
        hide-details
      />
    </v-col>
    <v-spacer />
    <primary-btn
      :disabled="!item.name"
      :loading="loading"
      class="mb-1 mr-3"
      @click="saveItem"
    >
      Save
    </primary-btn>
  </v-row>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      item: {},
      loading: true,
    };
  },
  computed: {
    visibleFields() {
      switch (this.item.type) {
        case 'quiz':
          return ['url', 'csvUrl', 'requiredScore', 'expiry', 'required'];
        case 'induction':
          return ['url', 'expiry', 'required', 'inductorIds'];
        case 'completion':
          return ['required', 'trainingId'];
        default:
          return ['url'];
      }
    },
    trainings() {
      const { Training } = this.$FeathersVuex.api;
      const { data } = Training.findInStore({
        query: {
          _id: { $ne: this.$route.params.id },
          $sort: { name: 1 },
        },
      });
      return data;
    },
  },
  async mounted() {
    await this.loadItem();
  },
  watch: {
    async id(to, from) {
      if (to === from) return;
      await this.loadItem();
    },
  },
  methods: {
    async loadItem() {
      const { TrainingItem } = this.$FeathersVuex.api;
      let item;
      this.loading = true;
      try {
        item = TrainingItem.getFromStore(this.id);
        if (!item) item = await TrainingItem.get(this.id);
        this.item = item.clone();
      } catch (err) {
        // TODO: render error
        // eslint-disable-next-line no-console
        console.error(err);
      }
      this.loading = false;
    },
    async saveItem() {
      this.loading = true;
      try {
        await this.item.save();
        await this.loadItem();
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
