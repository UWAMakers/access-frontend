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
          <v-row align="center" class="pr-2">
            <v-col cols="auto" class="pr-1">
              <item-mover
                :items="value"
                :item="item._id"
                @update:items="$emit('input', $event)"
              />
            </v-col>
            <v-col class="px-1">
              <strong>{{item.name}}</strong>
            </v-col>
            <v-col cols="auto" class="pl-1">
              <v-chip small class="mr-2">
                {{types.find(t => t.value === item.type).text}}
              </v-chip>
              <delete-dialog :name="item.name" @delete="deleteItem(item)" />
            </v-col>
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
import ItemMover from '@/components/input/item-mover.vue';

export default {
  components: {
    TrainingAdd,
    EditItem,
    ItemMover,
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
        { text: 'Review Document', value: 'review' },
        { text: 'Google Quiz', value: 'quiz' },
        { text: 'Required Training', value: 'completion' },
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
        this.$handleError(err, 'loading training items');
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
        this.$success('removed training item');
        this.$emit('input', this.value.filter((id) => id !== item._id));
      } catch (err) {
        this.$handleError(err, 'deleting training item');
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
