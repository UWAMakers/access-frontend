<template>
  <div>
    <v-card-text>
      <div v-if="!linkToken">
        <v-btn
          v-for="login in socialLogins"
          :key="login.ref"
          :color="login.color"
          :dark="login.isDark"
          block
          depressed
          :href="getLoginUrl(login)"
          >
          <simple-icon :icon="login.icon" :color="login.isDark ? 'white' : 'black'" left />
          Continue with {{ login.name }}
        </v-btn>
        <v-divider class="my-4" />
      </div>
      <v-select
        v-model="domain"
        :items="domainOptions"
        label="Domain"
        outlined
      />
      <v-text-field
        v-if="domain !== 'other'"
        :value="email.replace(`@${domain}`, '')"
        :error-messages="emailErrors"
        label="Pheme Number"
        placeholder="12345678"
        outlined
        @keypress.enter="submit()"
        @blur="$v.email.$touch()"
        @input="$emit('update:email', $event && `${$event}@${domain}`)"
      />
      <v-text-field
        v-else
        :value="email"
        :error-messages="emailErrors"
        label="Email Address"
        placeholder="12345678@student.uwa.edu.au"
        outlined
        @keypress.enter="submit()"
        @blur="$v.email.$touch()"
        @input="$emit('update:email', $event)"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <primary-btn :loading="loading" @click="submit()">
        Continue
      </primary-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, email } from 'vuelidate/lib/validators';
import socialLogins from '@/util/social-logins';

export default {
  mixins: [validationMixin],
  validations() {
    return {
      email: {
        required,
        email,
        pheme: (v) => this.domain === 'other' || /^(\d{8,10})|(v\d{5,10})@/.test(v),
      },
    };
  },
  props: {
    email: {
      type: String,
      default: '',
    },
    domains: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      errMsg: '',
      domain: '',
      socialLogins,
    };
  },
  computed: {
    domainOptions() {
      const domains = this.domains.map((d) => ({ text: d, value: d }));
      domains.push({ text: 'Other', value: 'other' });
      return domains;
    },
    emailErrors() {
      if (!this.$v.email.$dirty) return '';
      if (!this.$v.email.required) return `${this.domain === 'other' ? 'Email' : 'Pheme'} is required`;
      if (!this.$v.email.email) return 'Email must be valid';
      if (!this.$v.email.pheme) return 'Pheme Number must be valid';
      return '';
    },
    linkToken() {
      return this.$route.query.linkToken;
    },
  },
  watch: {
    domains: {
      handler() {
        if (this.domains.length && !this.domain) {
          [this.domain] = this.domains;
        }
      },
      immediate: true,
    },
    domain(to, from) {
      if (to !== from) {
        this.$emit('update:email', '');
      }
    },
  },
  methods: {
    async submit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.loading = true;
      this.$emit('error', '');
      try {
        await this.$store.dispatch('auth/authenticate', {
          strategy: 'magic',
          email: this.email,
          linkToken: this.linkToken || undefined,
        });
      } catch (error) {
        if (error.data?.action) {
          this.$emit('update:action', error.data?.action);
        } else {
          // eslint-disable-next-line no-console
          console.error(error);
          this.$emit('error', error.message);
        }
      }
      this.loading = false;
    },
    getLoginUrl(login) {
      let apiUrl = process.env.VUE_APP_API_URL;
      if (apiUrl === '/') apiUrl = window.location.origin;
      return `${apiUrl}/oauth/${login.ref}?redirect=/`;
    },
  },
};
</script>
