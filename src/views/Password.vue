<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Enter your password</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form v-model="isValid">
            <v-progress-linear indeterminate color="primary" v-if="loading"></v-progress-linear>

            <v-text-field
              id="password"
              label="Password"
              name="password"
              prepend-icon="mdi-lock"
              type="password"
              :rules="validationRules.password"
              v-model="password"
            ></v-text-field>

            <v-text-field
              id="repassword"
              label="Retype Password"
              name="repassword"
              prepend-icon="mdi-lock"
              type="password"
              :rules=[matchedPasswords]
              v-model="repassword"
            ></v-text-field>

          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="submit" :disabled="!isValid || loading">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>

</template>

<script>
import sendRequest from '@/services/api';

const validationRules = {
  password: [
    (v) => !!v || 'Password is required',
    (v) => (v.length >= 8) || 'Password must have 8+ characters',
  ],
};
export default {
  name: 'Register',
  data: () => ({
    password: '',
    repassword: '',
    isValid: false,
    loading: false,
    validationRules,
  }),
  computed: {
    matchedPasswords() {
      return this.password === this.repassword || 'Mismatched passwords!';
    },
  },
  methods: {
    async submit(e) {
      e.preventDefault();
      this.loading = true;
      try {
        const { password, repassword } = this;
        const { token } = this.$route.query;
        await sendRequest('POST', 'users/password', {
          password, repassword, token,
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

  async beforeCreate() {
    const { token } = this.$route.query;
    try {
      await sendRequest('POST', 'users/token', {
        token,
      });
    } catch (error) {
      this.$router.push({ name: 'Login' });
      if (error.name === 'API_ERROR') {
        this.$root.showErrorMessage(error.message);
      } else {
        this.$root.showErrorMessage('Something went wrong');
      }
    }
  },
};
</script>
