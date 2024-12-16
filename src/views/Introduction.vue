<template>
  <div class="intro-container">
    <div class="intro-title">
      <h1 id="title"></h1>
    </div>
    <div class="intro-content">
      <section class="text-content left" data-scroll>
        <div class="image-container left" data-scroll>
          <img src="@/assets/worldcup_list_example.png" alt="Left Image" class="intro-img"/>
        </div>
        <div class="text-box right">
          <h1 id="subtitle">가지각색 이상형 월드컵을 즐겨보세요!</h1>
          <p>재미있게 즐긴 월드컵에 좋아요와 댓글로 소통하며 취향을 공유하고</p>
          <p>전체 통계를 통해 가장 인기 있었던 후보가 누구였는지도 찾아보세요! </p>
        </div>
      </section>
      <section class="text-content right" data-scroll>
        <div class="image-container right" data-scroll>
          <img src="@/assets/create_worldcup_example.png" alt="right Image" class="intro-img"/>
        </div>
        <div class="text-box left">
          <h1 id="subtitle">나만의 월드컵을 만들어보세요!</h1>
          <p>최소 2강부터 최대 128강까지!</p>
          <p>카테고리에 상관없이</p>
          <p>내가 만들고싶은 월드컵을 마음껏 만들어보세요!</p>
          
        </div>
      </section>
      <section class="text-content left" data-scroll>
        <div class="image-container left" data-scroll>
          <img src="@/assets/mypage_example.png" class="intro-img" />
        </div>
        <div class="text-box right">
          <h1 id="subtitle">내 정보를 한눈에!</h1>
          <p>내 프로필을 통한 나의 정보를 확인할 수 있어요!</p>
          <p>내 월드컵을 통해 내가만든 월드컵 관리할 수 있어요!</p>
          <p>내 활동에서 좋아요한 월드컵, 내가 단 댓글을 확인할 수 있어요!</p>
          <p>열심히 활동하고 레벨을 올리면 멋진 배지도 받을 수 있어요. 친구들에게 자랑해보세요!</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  import TypeIt from "typeit";
  import ScrollOut from "scroll-out";

  //TODO: 소개 페이지 텍스트를 하드코딩할지 의논 필요. 주기적으로 바꾸지 않으면 그냥 하드코딩이 나을 듯 싶음.

  export default {
    name: "Introduction",
    mounted() {
      document.title = '이상형 월드컵 | Ideal type worldcup';

      new TypeIt("#title", {
        strings: "이상형 월드컵",
        speed: 50,
        waitUntilVisible: true,
        loop: true
      }).pause(2000).delete(7).type("Ideal Type World Cup").go();

      ScrollOut({
        onShown: function(el) {
          if (el.querySelector('#subtitle')) {
            new TypeIt(el.querySelector('#subtitle'), {
              startDelay: 500,
              cursor: false,
            }).pause(2000).go();
          }

          if (el.querySelector(".scroll-image")) {
            el.querySelector(".scroll-image").classList.add("animate-in");
          }
        }
      });
    }
  };
</script>

<style scoped>
.intro-container{
  padding: 20px;
 }

 .intro-content{
    padding: 10px;
   }
  
   .text-content {
    display: flex;
    align-items: center;
    margin-bottom: 300px;
   }
  
   [data-scroll] {
    opacity: 0;
    will-change: transform, scale, opacity;
    transform: translateY(6rem) scale(1);
    transition: all 1.5s cubic-bezier(0.165, 0.84, 0.44, 1);
   }
   [data-scroll="in"] {
    opacity: 1;
    transform: translateY(0) scale(1);
   }
   [data-scroll="out"] {
    opacity: 0;
   }
  
   .image-container {
    width: 50vw;
    flex-shrink: 0;
    transition: opacity 1s ease, transform 1s ease;
   }
  
   .image-container.left {
    margin-right: 20px;
    transform: translateX(-20px);
   }
  
   .image-container.right {
    margin-left: 20px;
    transform: translateX(20px);
   }
  
   .image-container img {
    width: 40vw;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
   }
  
   .image-container[data-scroll="in"] {
    opacity: 1;
    transform: translateX(0);
   }
  
   .image-container[data-scroll="out"] {
    opacity: 0;
   }
  
   .text-box {
    flex: 1;
    width: 40vw;
   }
  
   .text-box.left {
    text-align: end;
   }
  
   .text-box.right {
    text-align: start;
   }
  
   .text-content.left {
    flex-direction: row; /* 이미지를 왼쪽에, 텍스트를 오른쪽에 */
   }
  
   .text-content.right {
    flex-direction: row-reverse; /* 이미지를 오른쪽에, 텍스트를 왼쪽에 */
   }
  
   h1 {
    font-size: 3vw; /* 뷰포트 너비의 5% */
   }
  
   p {
    font-size: 1vw; /* 뷰포트 너비의 2% */
   }
</style>
