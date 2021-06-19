<template>
  <v-row class="pa-4">
    <v-col v-show="!id" cols="12" md="6">
      <v-card outlined>
        <v-card-text>
          No config selected, select one to get editing.
        </v-card-text>
      </v-card>
    </v-col>
    <v-col v-show="id" cols="12" md="6">
      <v-card outlined>
        <v-card-title>
          Edit Training Config
          <v-spacer />
          <delete-dialog :name="config.name" @delete="configAction('delete')" />
          <v-btn icon :to="`/training/${config._id}`">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model.trim="config.name"
            label="Name"
            outlined
          />
          <v-textarea
            v-model.trim="config.desc"
            label="Description"
            hint="Markdown supported"
            rows="7"
            outlined
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <primary-btn
            :loading="loading"
            :disabled="!config.name || !changed"
            @click="configAction('save')"
          >
            Save
          </primary-btn>
        </v-card-actions>
      </v-card>
      <v-card class="mt-4" outlined>
        <v-card-text class="pb-0">
          <i>Preview</i>
        </v-card-text>
        <v-card-title>
          {{config.name}}
        </v-card-title>
        <v-card-text>
          <div v-html="fromMd(config.desc)" />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col v-show="id" cols="12" md="6">
      <training-items v-model="config.itemIds" @input="configAction('patch-items')" />
    </v-col>
  </v-row>
</template>

<script>
import { fromMd } from '@/util/markdown';
import TrainingItems from '@/components/trainings/items.vue';

export default {
  components: {
    TrainingItems,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      config: {},
      loading: false,
      deleteDialog: false,
    };
  },
  computed: {
    changed() {
      const { Training } = this.$FeathersVuex.api;
      const config = Training.getFromStore(this.id);
      return config.name !== this.config.name
        || config.desc !== this.config.desc
        || [...config.itemIds].sort().join('-') !== [...this.config.itemIds].sort().join('-');
    },
  },
  async mounted() {
    await this.loadConfig();
  },
  watch: {
    async id(to, from) {
      if (to === from) return;
      await this.loadConfig();
    },
  },
  methods: {
    fromMd,
    async loadConfig() {
      if (!this.id) return;
      const { Training } = this.$FeathersVuex.api;
      let config;
      this.loading = true;
      try {
        config = Training.getFromStore(this.id);
        if (!config) config = await Training.get(this.id);
        this.config = config.clone();
      } catch (err) {
        this.$handleError(err, 'loading training config');
      }
      this.loading = false;
    },
    async configAction(action) {
      this.loading = true;
      try {
        switch (action) {
          case 'patch-items':
            await this.$store.dispatch('trainings/patch', [
              this.id,
              { itemIds: this.config.itemIds },
            ]);
            break;
          case 'delete':
            await this.config.remove();
            this.$router.push('/training-config');
            this.$success('removed training config');
            break;
          default:
            delete this.config.order;
            await this.config.save();
            this.$success('saved training config');
            await this.loadConfig();
        }
      } catch (err) {
        switch (action) {
          case 'patch-items':
            this.$handleError(err, 'adding/removing training item to/from config');
            break;
          case 'delete':
            this.$handleError(err, 'deleting training config');
            break;
          default:
            this.$handleError(err, 'saving training config');
        }
      }
      this.loading = false;
    },
  },
};
</script>
