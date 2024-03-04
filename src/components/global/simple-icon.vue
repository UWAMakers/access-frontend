<template>
  <img
    :height="dim"
    :width="dim"
    :class="{ 'mr-2': left, 'ml-2': right }"
    :src="iconSrc"
  />
</template>

<script>
export default {
  name: 'SimpleIcon',
  props: {
    icon: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'regular',
    },
    color: {
      type: String,
      default: 'text',
    },
    left: {
      type: Boolean,
      default: false,
    },
    right: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    dim() {
      switch (this.size) {
        case 'x-small':
          return 12;
        case 'small':
          return 16;
        case 'large':
          return 36;
        case 'x-large':
          return 40;
        default:
          return 24;
      }
    },
    isDark() {
      return this.$vuetify.theme.dark;
    },
    iconColor() {
      if (this.color === 'text') return this.isDark ? 'white' : 'black';
      if (this.color === '!text') return this.isDark ? 'black' : 'white';
      return this.color;
    },
    iconSrc() {
      return `https://cdn.simpleicons.org/${this.icon}/${this.iconColor}`;
    },
  },
};
</script>
