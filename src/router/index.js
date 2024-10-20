import { createRouter, createWebHistory } from 'vue-router';

// views
import Home from '@/views/Home.vue';
import Introduction from '@/views/Introduction.vue';
import CreateWorldcup from '@/views/CreateWorldcup.vue';
import SignIn from '@/views/SignIn.vue';
import SignUp from '@/views/SignUp.vue';
import MyPage from '@/views/MyPage.vue';

// views/admin
import BackOffice from '@/views/admin/BackOffice.vue';
import Dashboard from '@/components/admin/Dashboard.vue';
import UserList from '@/components/admin/UserList.vue';
import WorldcupManagement from "@/components/admin/WorldcupManagement.vue";
import ReportReceive from '@/components/admin/ReportReceive.vue';
import Questions from '@/components/admin/Questions.vue'
import Settings from '@/components/admin/Settings.vue';

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
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: 'user-list',
        name: 'UsersList',
        component: UserList,
      },
      {
        path: 'worldcup-management',
        name: 'WorldcupManagement',
        component: WorldcupManagement,
      },
      {
        path: 'report-receive',
        name: 'ReportReceive',
        component: ReportReceive,
      },
      {
        path: 'questions',
        name: 'Questions',
        component: Questions,
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings,
      },
    ]
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