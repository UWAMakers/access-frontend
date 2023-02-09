<template>
  <v-dialog v-model="dialog" max-width="400">
    <template #activator="{ on }">
      <slot name="activator" :on="on" />
    </template>
    <v-card outlined>
      <v-card-title>
        Add User
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model.trim="email"
          label="Email"
          outlined
          :error-messages="emailErrors"
          @blur="$v.email.$touch()"
        />
        <v-text-field
          v-model.trim="username"
          label="Username"
          outlined
          :error-messages="usernameErrors"
          @blur="$v.username.$touch()"
        />
        <v-text-field
          v-model.trim="firstName"
          label="First Name"
          outlined
          :error-messages="firstNameErrors"
          @blur="$v.firstName.$touch()"
        />
        <v-text-field
          v-model.trim="lastName"
          label="Last Name"
          outlined
          :error-messages="lastNameErrors"
          @blur="$v.lastName.$touch()"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false"> Cancel </v-btn>
        <primary-btn :loading="loading" @click="submit"> Save </primary-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
      },
      username: { required },
      firstName: { required },
      lastName: { required },
    };
  },
  data() {
    return {
      dialog: false,
      loading: false,
      email: '',
      username: '',
      firstName: '',
      lastName: '',
    };
  },
  computed: {
    emailErrors() {
      if (!this.$v.email.$dirty) return '';
      if (!this.$v.email.required) return 'Email is required';
      if (!this.$v.email.email) return 'Email must be valid';
      return '';
    },
    usernameErrors() {
      if (!this.$v.username.$dirty) return '';
      if (!this.$v.username.required) return 'Username is required';
      return '';
    },
    firstNameErrors() {
      if (!this.$v.firstName.$dirty) return '';
      if (!this.$v.firstName.required) return 'First Name is required';
      return '';
    },
    lastNameErrors() {
      if (!this.$v.lastName.$dirty) return '';
      if (!this.$v.lastName.required) return 'Last Name is required';
      return '';
    },
  },
  methods: {
    reset() {
      this.email = '';
      this.username = '';
      this.firstName = '';
      this.lastName = '';
      this.$v.$reset();
    },
    async submit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.loading = true;
      const { User } = this.$FeathersVuex.api;
      await this.$try('creating user', async () => {
        let user = new User({
          email: this.email,
          username: this.username,
          firstName: this.firstName,
          lastName: this.lastName,
        });
        user = await user.save();
        this.$router.push(`/user/${user._id}`);
        this.dialog = false;
        this.reset();
      }, { success: true });
      this.loading = false;
    },
  },
};
</script>
