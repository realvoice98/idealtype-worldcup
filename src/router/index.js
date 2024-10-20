import { createRouter, createWebHistory } from 'vue-router';

// views
import Home from '@/views/Home.vue';
import Introduction from '@/views/Introduction.vue';
import CreateWorldcup from "@/views/CreateWorldcup.vue";
import SignIn from '@/views/SignIn.vue';
import SignUp from '@/views/SignUp.vue';
import MyPage from "@/views/MyPage.vue";

// views/admin
import BackOffice from '@/views/admin/BackOffice.vue';
import UserList from "@/components/admin/UserList.vue";

const routes = [
  // views
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
    path: '/my-page',
    name: 'MyPage',
    component: MyPage,
  },

  // views/admin
  {
    path: '/bo',
    name: 'BackOffice',
    component: BackOffice,
  },
  {
    path: '/bo/user-list',
    name: 'UserList',
    component: UserList,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;