import Vue from 'vue';
import VueRouter from 'vue-router';
import Chat from '../views/Chat.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Password from '../views/Password.vue';
import { requireAuthentication } from '../services/auth';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Chat,
    beforeEnter: requireAuthentication,
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat,
    beforeEnter: requireAuthentication,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/password',
    name: 'Password',
    component: Password,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
