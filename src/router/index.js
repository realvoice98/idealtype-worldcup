import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Introduction from '@/views/Introduction.vue';
import CreateWorldcup from "@/views/CreateWorldcup.vue";
import SignIn from '@/views/SignIn.vue';
import SignUp from '@/views/SignUp.vue';
import AdminHome from '@/views/admin/Home.vue';
import MyPage from "@/views/MyPage.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/introduction',
    name: 'Introduction',
    component: Introduction,
  },
  {
    path: '/create-worldcup',
    name: 'CreateWorldcup',
    component: CreateWorldcup,
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    component: SignIn,
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp,
  },
  {
    path: '/admin-home',
    name: 'AdminHome',
    component: AdminHome,
  },
  {
    path: '/my-page',
    name: 'MyPage',
    component: MyPage,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;