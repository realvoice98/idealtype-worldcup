import { createRouter, createWebHistory } from 'vue-router';

// views
import Home from '@/views/Home.vue';
import Introduction from '@/views/Introduction.vue';
import CreateWorldcup from '@/views/worldcup/CreateWorldcup.vue';
import SignIn from '@/views/user/SignIn.vue';
import SignUp from '@/views/user/SignUp.vue';

import MyPage from '@/views/user/MyPage.vue';
import ProfileDetail from '@/components/user/ProfileDetail.vue';
import WorldcupList from '@/components/user/WorldcupList.vue';
import Activity from '@/components/user/Activity.vue';

import WorldcupResult from '@/views/worldcup/WorldCupResult.vue';
import WorldcupDetail from '@/views/worldcup/WorldcupDetail.vue';

// views/admin
import BackOffice from '@/views/admin/BackOffice.vue';
import Dashboard from '@/components/admin/Dashboard.vue';
import UserList from '@/components/admin/UserList.vue';
import WorldcupManagement from "@/components/admin/WorldcupManagement.vue";
import ReportReceive from '@/components/admin/ReportReceive.vue';
import Questions from '@/components/admin/Questions.vue';
import Settings from '@/components/admin/Settings.vue';
import CreatedWorldcups from '@/components/admin/CreatedWorldcups.vue';

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
    path: '/create-wldcup',
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
    children: [
      {
        path: 'profile',
        name: 'ProfileDetail',
        component: ProfileDetail,
      },
      {
        path: 'wldcups',
        name: 'WorldcupList',
        component: WorldcupList,
      },
      {
        path: 'activity',
        name: 'Activity',
        component: Activity,
      },
    ]
  },
  {
    path: '/wldcup-result/:id',
    name: 'WorldcupResult',
    component: WorldcupResult
  },
  {
    path: '/wldcup/:id',
    name: 'WorldcupDetail',
    component: WorldcupDetail,
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
        children: [
          {
            path: 'created-wldcups',
            name: 'CreatedWorldcups',
            component: CreatedWorldcups,
          },
        ],
      },
      {
        path: 'wldcup-management',
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
