<template>
  <div>
    <v-card-text>
      <p>
        We need a few more details to create your account for
        <i>{{ email }}</i>.
      </p>
      <v-text-field
        v-model.trim="firstName"
        :error-messages="firstNameErrors"
        label="First Name"
        placeholder="Jo"
        outlined
        @blur="$v.firstName.$touch()"
      />
      <v-text-field
        v-model.trim="lastName"
        :error-messages="lastNameErrors"
        label="Last Name"
        placeholder="Smith"
        outlined
        @blur="$v.lastName.$touch()"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn text @click="$emit('update:action', 'email')">Back</v-btn>
      <v-spacer />
      <primary-btn :loading="loading" @click="submit()">
        Sign Up
      </primary-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';

export default {
  mixins: [validationMixin],
  validations() {
    return {
      firstName: {
        required,
        minLength: minLength(2),
      },
      lastName: {
        required,
        minLength: minLength(2),
      },
    };
  },
  props: {
    email: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      firstName: '',
      lastName: '',
      loading: false,
      errMsg: '',
    };
  },
  computed: {
    firstNameErrors() {
      if (!this.$v.firstName.$dirty) return '';
      if (!this.$v.firstName.required) return 'First Name is required';
      if (!this.$v.firstName.minLength) return 'First Name must be at least 2 characters';
      return '';
    },
    lastNameErrors() {
      if (!this.$v.lastName.$dirty) return '';
      if (!this.$v.lastName.required) return 'Last Name is required';
      if (!this.$v.lastName.minLength) return 'Last Name must be at least 2 characters';
      return '';
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
          userData: {
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
          },
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
