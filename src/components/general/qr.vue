<template>
  <div ref="canvas" class="qr-wrap" />
</template>

<script>
import QRCodeStyling from 'qr-code-styling';

export default {
  props: {
    url: {
      type: String,
      default: '',
    },
  },
  watch: {
    url(to, from) {
      if (to !== from) this.generate();
    },
    '$vuetify.theme.dark': {
      handler(to, from) {
        if (to !== from) this.generate();
      },
    },
  },
  mounted() {
    setTimeout(() => this.generate(), 500);
  },
  methods: {
    generate() {
      if (!this.url) return;
      this.$refs.canvas.innerHTML = '';
      const color = this.$vuetify.theme.dark ? '#fff' : '#333';
      const qrCode = new QRCodeStyling({
        width: 600,
        height: 600,
        data: this.url,
        image: '/icon.png',
        dotsOptions: {
          // color: '#C62828',
          color,
          type: 'rounded',
        },
        cornersSquareOptions: {
          // color: '#B71C1C',
          color,
          type: 'extra-rounded',
        },
        backgroundOptions: {
          color: '#00000000',
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 20,
        },
      });
      qrCode.append(this.$refs.canvas);
    },
  },
};
</script>

<style>
.qr-wrap {
  display: inline-block;
}

.qr-wrap canvas {
  max-width: 100%;
}
</style>
