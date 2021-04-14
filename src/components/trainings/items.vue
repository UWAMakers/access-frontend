<template>
  <v-card outlined>
    <v-card-title>
      Training items
      <v-spacer />
      <training-add service="training-items" @create="itemCreated" />
    </v-card-title>
    <v-divider />
    <v-expansion-panels accordion>
      <v-expansion-panel
        v-for="item in items"
        :key="item._id"
        class="item-panel"
      >
        <v-expansion-panel-header>
          <v-row align="center" class="pl-2 pr-4">
            <strong>{{item.name}}</strong>
            <v-spacer />
            <v-chip small class="mr-2">
              {{types.find(t => t.value === item.type).text}}
            </v-chip>
            <delete-dialog :name="item.name" @delete="deleteItem(item)" />
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <edit-item :id="item._id" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>
import TrainingAdd from '@/components/trainings/add.vue';
import EditItem from '@/components/trainings/edit-item.vue';

export default {
  components: {
    TrainingAdd,
    EditItem,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      types: [
        { text: 'Comment', value: 'comment' },
        { text: 'Google Quiz', value: 'quiz' },
        { text: 'Other Training', value: 'completion' },
        { text: 'In-Person Induction', value: 'induction' },
      ],
    };
  },
  computed: {
    items() {
      const { TrainingItem } = this.$FeathersVuex.api;
      const { data: items } = TrainingItem.findInStore({
        query: {
          _id: { $in: this.value },
        },
      });
      return this.value.map((id) => items.find((item) => item._id === id)).filter((v) => v);
    },
  },
  watch: {
    async value() {
      await this.loadItems();
    },
  },
  async mounted() {
    await this.loadItems();
  },
  methods: {
    async loadItems() {
      const { TrainingItem } = this.$FeathersVuex.api;
      const missingIds = this.value.filter((id) => !this.items.some((item) => item._id === id));
      if (!missingIds.length) return;
      this.loading = true;
      try {
        await TrainingItem.find({
          query: {
            _id: { $in: missingIds },
          },
          paginate: false,
        });
      } catch (err) {
        // TODO: render error
        // eslint-disable-next-line no-console
        console.error(err);
      }
      this.loading = false;
    },
    itemCreated(item) {
      this.$emit('input', [...this.value, item._id]);
    },
    async deleteItem(item) {
      this.loading = true;
      try {
        await item.remove();
        this.$emit('input', this.value.filter((id) => id !== item._id));
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

<style scoped>
.item-panel::before {
  box-shadow: none;
}
</style>
