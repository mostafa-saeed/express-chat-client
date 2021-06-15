<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Register</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form v-model="isValid">
            <v-progress-linear indeterminate color="primary" v-if="loading"></v-progress-linear>

            <v-text-field
              label="Username"
              name="username"
              prepend-icon="mdi-account"
              type="text"
              :rules="validationRules.username"
              v-model="username"
            ></v-text-field>

            <v-text-field
              label="Email"
              name="email"
              prepend-icon="mdi-mail"
              type="email"
              :rules="validationRules.email"
              v-model="email"
            ></v-text-field>

          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="submit" :disabled="!isValid || loading">Register</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>

</template>

<script>
import sendRequest from '@/services/api';

const EMAIL_REGEX = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/;

const validationRules = {
  username: [
    (v) => !!v || 'Username is required',
    (v) => v.length > 1 || 'Username is short',
  ],
  email: [
    (v) => !!v || 'Email is required',
    (v) => EMAIL_REGEX.test(v) || 'Invalid email',
  ],
};

export default {
  name: 'Register',
  data: () => ({
    username: '',
    email: '',
    isValid: false,
    loading: false,
    validationRules,
  }),
  methods: {
    async submit(e) {
      e.preventDefault();
      this.loading = true;
      try {
        const { username, email } = this;
        await sendRequest('POST', 'users', {
          username, email,
        });
        this.loading = false;
        this.$router.push({ name: 'Login' });
      } catch (error) {
        this.loading = false;
        if (error.name === 'API_ERROR') {
          this.$root.showErrorMessage(error.message);
        } else {
          this.$root.showErrorMessage('Something went wrong');
        }
      }
    },
  },
};
</script>
