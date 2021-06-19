<template>
  <div class="mover-wrap">
    <v-btn v-show="index !== 0" icon x-small @click.prevent.stop="move(-1)">
      <v-icon small>mdi-arrow-up-circle-outline</v-icon>
    </v-btn>
    <v-btn v-show="index !== items.length - 1" icon x-small @click.prevent.stop="move(1)">
      <v-icon small>mdi-arrow-down-circle-outline</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    item: {
      type: [Object, String, Number],
      required: true,
    },
  },
  computed: {
    index() {
      return this.items.indexOf(this.item);
    },
  },
  methods: {
    move(factor) {
      const items = [...this.items];
      items.splice(this.index + factor, 0, items.splice(this.index, 1)[0]);
      this.$emit('update:items', items);
    },
  },
};
</script>

<style scoped>
.mover-wrap {
  width: 20px;
  height: 40px;
  margin-right: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
