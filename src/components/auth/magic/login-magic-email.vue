<template>
  <div>
    <v-card-text>
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
      if (!this.$v.email.required) return 'Email is required';
      if (!this.$v.email.email) return 'Email must be valid';
      if (!this.$v.email.pheme) return 'Pheme Number must be valid';
      return '';
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
  },
};
</script>
