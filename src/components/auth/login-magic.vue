<template>
  <v-card outlined>
    <v-img alt="UWA Makers" src="/logo.png" contain width="80%" class="mx-auto mt-2" />
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text v-show="errMsg">
      <v-alert color="error">
        There was a problem your {{ title.toLowerCase() }}:<br />
        {{ errMsg }}
      </v-alert>
    </v-card-text>
    <v-tabs-items v-model="tab">
      <v-tab-item value="email">
        <login-magic-email
          :action.sync="action"
          :email.sync="email"
          :domains="domains"
          @error="errMsg = $event"
        />
      </v-tab-item>
      <v-tab-item value="signup">
        <login-magic-signup
          :action.sync="action"
          :email="email"
          :domains="domains"
          @error="errMsg = $event"
        />
      </v-tab-item>
      <v-tab-item value="wait">
        <login-magic-wait
          :action.sync="action"
          @error="errMsg = $event"
        />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import LoginMagicEmail from '@/components/auth/magic/login-magic-email.vue';
import LoginMagicWait from '@/components/auth/magic/login-magic-wait.vue';
import LoginMagicSignup from '@/components/auth/magic/login-magic-signup.vue';

export default {
  components: {
    LoginMagicEmail,
    LoginMagicWait,
    LoginMagicSignup,
  },
  data() {
    return {
      errMsg: '',
      action: 'email',
      tab: 'email',
      title: 'Login',
      email: '',
      domains: ['student.uwa.edu.au', 'uwa.edu.au'],
    };
  },
  watch: {
    action: {
      handler(to, from) {
        if (to === from) return;
        switch (to) {
          case 'magic_signup_required':
            this.tab = 'signup';
            this.title = 'Sign Up';
            break;
          case 'magic_signup_sent':
            this.tab = 'wait';
            this.title = 'Sign Up';
            break;
          case 'magic_login_sent':
            this.tab = 'wait';
            this.title = 'Login';
            break;
          case 'success':
            this.success();
            break;
          default:
            this.tab = 'email';
            this.title = 'Login';
            break;
        }
      },
      immediate: true,
    },
  },
  methods: {
    async success() {
      if (this.$route.query.followPath) {
        await this.$router.push(this.$route.query.followPath);
      } else {
        await this.$router.push('/');
      }
    },
  },
};

</script>
