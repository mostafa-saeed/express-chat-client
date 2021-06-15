<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item link to="/">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="token" link to="/chat" exact>
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>chat</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="token" @click="logout">
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="!token" link to="/login" exact>
          <v-list-item-action>
            <v-icon>mdi-login</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="!token" link to="/register" exact>
          <v-list-item-action>
            <v-icon>mdi-account-multiple</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Register</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Express Chat</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon large @click="toggleDarkMode">
        <v-icon>mdi-invert-colors</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-snackbar color="error" top timeout="5000" v-model="showMessage">
        {{ message }}
        <template v-slot:action="{ attrs }">
          <v-btn dark text v-bind="attrs" @click="showMessage = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
      <v-container class="fill-height" fluid>
        <router-view :token="token" />
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
html {
  overflow: auto !important;
}
</style>

<script>
import Vue from 'vue';
import { getToken } from './services/auth';

const darkMode = localStorage.getItem('darkMode');

export default {
  name: 'App',
  data: () => ({
    drawer: false,
    showMessage: false,
    token: !!getToken(),
    message: '',
    eventHub: new Vue(),
  }),
  methods: {
    toggleDarkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem('darkMode', this.$vuetify.theme.dark || '');
    },
    showErrorMessage(message) {
      this.message = message;
      this.showMessage = true;
    },
    login(token) {
      this.token = !!token;
      localStorage.setItem('token', token);
      this.$router.push({ name: 'Chat' });
    },
    logout() {
      this.token = null;
      localStorage.removeItem('token');
      this.$router.push({ name: 'Login' });
      this.eventHub.$emit('logout');
    },
  },
  created() {
    this.$vuetify.theme.dark = darkMode;
    this.$root.showErrorMessage = this.showErrorMessage;
    this.$root.login = this.login;
    this.$root.eventHub = this.eventHub;
  },
};
</script>
