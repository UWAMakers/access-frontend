<template>
  <v-avatar :color="color" v-bind="$attrs" v-on="$listeners">
    <img
      v-if="avatarUrl"
      :src="avatarUrl"
      alt=""
    />
    <span v-else class="white--text">
      {{ initials }}
    </span>
  </v-avatar>
</template>

<script>
const colors = [
  '#52BDC5',
  '#F46960',
  '#FCB25E',
  '#008F4D',
  '#515151',
  '#EF5273',
  '#0091C5',
  '#0078BA',
];

export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  computed: {
    initials() {
      return this.user.firstName.charAt(0) + this.user.lastName.charAt(0);
    },
    avatarUrl() {
      return this.user.preferences?.avatarUrl || '';
    },
    color() {
      // eslint-disable-next-line
      const num = parseInt(this.user._id.substr(-4, 4), 16);
      return colors[num % colors.length];
    },
  },
};
</script>
