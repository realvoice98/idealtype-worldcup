<template>
  <div>
    <!-- 사이드바 -->
    <div class="sidebar" :class="{ 'close': !isSidebarOpen }">
      <header>
      <router-link class="image-text" to="/bo" :class="{ 'hidden': !isSidebarOpen }">
        <span class="image">
          <img src="../../assets/logo-black.png" alt="Left Image" width="40" height="32"></img>
        </span>

        <div class="text header-text">
          <span class="name">Undefined</span>
          <span class="profession">Back Office</span>
        </div>

      </router-link>
      
      <box-icon name='chevron-right' class="toggle" @click="toggleSidebar"></box-icon>
      </header>
      <div class="menu-bar">
        <div class="menu">
          <ul class="menu-links">
            <!-- <li class="nav-links">
              <box-icon class="icon" type='solid' name='dashboard'></box-icon>
              <router-link class="nav-link text" to="/bo/dashboard" :class="{ 'hidden': !isSidebarOpen }">대시보드</router-link>
            </li> -->
            <router-link class="nav-links" to="/bo/dashboard" >
              <box-icon class="icon" type='solid' name='dashboard'></box-icon>
              <span v-if="isSidebarOpen" class="text" :class="{ 'hidden': !isSidebarOpen }">대시보드</span>
            </router-link>
            <router-link class="nav-links" to="/bo/user-list">
              <box-icon class="icon" name='user-pin' ></box-icon>
              <span v-if="isSidebarOpen" class="nav-link text" :class="{ 'hidden': !isSidebarOpen }">사용자 목록</span>
            </router-link>
            <router-link class="nav-links" to="/bo/wldcup-management">
              <box-icon  class="icon" name='world' ></box-icon>
              <span v-if="isSidebarOpen" class="nav-link text"  :class="{ 'hidden': !isSidebarOpen }">월드컵 관리</span>
            </router-link>
            <router-link class="nav-links" to="/bo/report-receive">
              <box-icon class="icon" name='shield-alt-2'></box-icon>
              <span v-if="isSidebarOpen" class="nav-link text"  :class="{ 'hidden': !isSidebarOpen }">신고접수</span>
            </router-link>
            <router-link class="nav-links" to="/bo/questions">
              <box-icon class="icon" name='question-mark' ></box-icon>
              <span v-if="isSidebarOpen" class="nav-link text"  :class="{ 'hidden': !isSidebarOpen }">문의사항</span>
            </router-link>
            <router-link class="nav-links" to="/bo/settings">
              <box-icon class="icon" name='cog' ></box-icon>
              <span v-if="isSidebarOpen" class="nav-link text"  :class="{ 'hidden': !isSidebarOpen }">설정</span>
            </router-link>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      isSidebarOpen: true, // 사이드바 초기 상태
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen; // 열림/닫힘 상태 전환
    },
  },
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 150px;
  padding: 5px 10px;
  background-color: var(--theme);
  transition: width 0.3s ease;
}

.close{
  width: 40px;
}

/* 텍스트 숨기기 */
.sidebar .hidden {
  visibility:unset;
  opacity: 0;
  width: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  display:none;
}

.sidebar ul{
  padding:0px;
}

.sidebar .nav-links {
  height: 50px;
  margin-top: 10px;
  list-style: none;
  display: flex;
  align-items: center;
  border-radius: 6px;
  gap:10px;
  padding: 0px 10px;
  text-decoration: none;
}

.sidebar .nav-links .icon{
  font-size: 20px;
}

.sidebar .nav-links:hover{
  background-color: white;
  transition: all 0.4s ease ;
}


.sidebar .nav-links .icon,
.sidebar .nav-links .text{
  color: #000000;
}

.sidebar .nav-links .text{
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 6px;
  transition: all 0.4s ease;
}

header{
  position: relative;
}

.sidebar .image-text{
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  text-decoration: none;
  color: #000000;
}

.sidebar .image-text img {
  width: 100%;
  height: 50px;
}


.sidebar header .image-text {
  display: flex;
  align-items: center;
}

header .image-text, .header-text {
  display: flex;
  flex-direction: column;
  justify-content: start;
}

.header-text .name {
  font-weight: 600;
  text-decoration: none;
}

.header-text .profession {
  margin-top: -2px;
  font-size: 13px;
}

.sidebar header .toggle {
  position: absolute;
  cursor: pointer;
  transition: transform 0.3s ease; /* 부드러운 회전 효과 */
  top: 50%;
  right: -25px;
  transform: translateY(-50%);
  height: 25px;
  width: 25px;
  background-color: white;
  /* border: 1px solid var(--theme); */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white;
  font-size: 25px;
}

/* close 상태: toggle 버튼 회전 */
.sidebar.close .toggle {
  transform: translateY(-50%) rotate(180deg); /* 180도 회전 */
}
</style>
