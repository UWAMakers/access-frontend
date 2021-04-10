import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      dark: {
        primary: '#BDBDBD',
        secondary: '#303030',
        accent: '#1976D2',
        success: '#4CAF50',
        info: '#2196F3',
        warning: '#FB8C00',
        error: '#E91E63',
      },
      light: {
        primary: '#303030',
        secondary: '#EEE',
        accent: '#1976D2',
        success: '#4CAF50',
        info: '#2196F3',
        warning: '#FB8C00',
        error: '#E91E63',
      },
    },
  },
});
