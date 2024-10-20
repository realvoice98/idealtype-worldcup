import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '@/services/firebase/auth'; // Firebase 인증 가져오기
import { onAuthStateChanged } from 'firebase/auth';

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
    meta: { requiresAuth: true },
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

router.beforeEach((to, from, next) => {
  // 현재 사용자의 인증 상태 확인
  onAuthStateChanged(auth, (user) => {
    const isLoggedIn = !!user;

    // 로그인 필요 여부 확인
    if (to.meta.requiresAuth && !isLoggedIn) {
      alert('로그인이 필요합니다!'); 
      next({ name: 'SignIn' });
    } else {
      next();
    }
  });
});

export default router;
