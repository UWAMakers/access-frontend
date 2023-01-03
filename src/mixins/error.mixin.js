const errMsg = (error, action, path, user) => `
An error occurred with "${action}"

Name: ${error.name}
Message: ${error.message}
Path: ${path}${user ? `
User: ${user.name} (${user.username})` : ''}
Stack:
${error.stack}
`;

const celebrateEmojis = ['🎉', '🎊', '✨', '🥳', '🍾', '🍆', '🎆', '🥂', '🍻', '🕺', '💃', '👍'];
const randomEmoji = () => celebrateEmojis[Math.floor(Math.random() * celebrateEmojis.length)];
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default {
  methods: {
    $handleError(error, action = 'something unknown') {
      // eslint-disable-next-line no-console
      console.error('Error occurred with', action);
      // eslint-disable-next-line no-console
      console.error(error);
      this.$store.commit('showSnackbar', {
        timeout: 10000,
        text: `Something went wrong with ${action}.`,
        severity: 'error',
        errorReport: errMsg(error, action, window.location.href, this.$user),
      });
    },
    $success(text = 'Success!') {
      this.$store.commit('showSnackbar', {
        text: `${randomEmoji()} Successfully ${text}!`,
        severity: 'success',
      });
    },
    async $try(action, fn, options = {}) {
      try {
        await fn();
        if (options.success) {
          this.$store.commit('showSnackbar', {
            text: `${randomEmoji()} ${capitalize(action)} was successful!`,
            severity: 'success',
          });
        }
      } catch (error) {
        if (options.onError) {
          options.onError(error);
        } else {
          this.$handleError(error, action);
        }
      }
    },
  },
};
