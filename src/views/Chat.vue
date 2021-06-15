<template>
    <v-row class="fill-height">
      <v-col class="col-8">
        <ul id="messages">
          <li v-for="(message, i) in messages" :key="i">
            <b>{{ message.username }}: </b>{{ message.text }}
          </li>
        </ul>
      </v-col>
      <v-col class="col-4">
        <ul id="users">
          <li v-for="(user, i) in users" :key="i">
            {{ user }}
          </li>
        </ul>
      </v-col>

    <v-footer fixed>
    <v-row>
      <v-col>
        <div class="d-flex flex-row align-center">
          <v-text-field v-model="text" placeholder="Type Something" @keypress.enter="submit"
            ></v-text-field>
          <v-btn icon class="ml-4" @click="submit"><v-icon>mdi-send</v-icon></v-btn>
        </div>
      </v-col>
    </v-row>
    </v-footer>
    </v-row>

</template>
<style scoped>
#messages {
  list-style-type: none;
  margin: 0;
  padding: 0;
  max-height: calc(100% - 92px);
  overflow: scroll;
}

#messages > li {
  padding: 0.5rem 1rem;
}

#messages > li:nth-child(odd) {
  background: #efefef;
}
</style>
<script>
import { io } from 'socket.io-client';
import sendRequest from '@/services/api';
import { getToken } from '@/services/auth';

const { VUE_APP_API_ENDPOINT } = process.env;

const validationRules = {
  text: [(v) => !!v || 'text is required'],
};

export default {
  name: 'Chat',
  data: () => ({
    text: '',
    messages: [],
    users: [],
    isValid: false,
    loading: false,
    validationRules,
    socket: io(VUE_APP_API_ENDPOINT, {
      extraHeaders: { Authorization: `Bearer ${getToken()}` },
    }),
  }),
  methods: {
    submit() {
      const text = this.text.trim().replace(/\s+/g, ' ');
      if (text) {
        this.socket.emit('chat message', this.text);
        this.text = '';
      }
    },
  },

  async beforeCreate() {
    this.messages = await sendRequest('GET', 'messages');
    this.socket.on('chat message', (message) => {
      this.messages.push(message);
      // Go to the last message
      const container = document.getElementById('messages');
      container.scrollTop = container.scrollHeight;
    });

    this.socket.on('online', (users) => {
      this.users = users;
    });

    this.$root.eventHub.$on('logout', () => this.socket.disconnect());
  },
};
</script>
