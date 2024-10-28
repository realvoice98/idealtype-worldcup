<template>
  <div class="intro-container">
    <div class="intro-title">
      <h1 id="title"></h1>
    </div>
    <div class="intro-content">
      <section class="text-content left" data-scroll>
        <div class="image-container left" data-scroll>
          <img src="@/assets/logo.png" alt="Left Image" />
        </div>
        <div class="text-box right">
          <h1 id="subtitle">Lorem ipsum</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
          <p>Nisl tincidunt eget nullam non.</p>
          <p>Quis hendrerit dolor magna eget est lorem ipsum dolor sit.</p>
          <p>Volutpat odio facilisis mauris sit amet massa.</p>
          <p>Commodo odio aenean sed adipiscing diam donec adipiscing tristique.</p>
          <p>Mi eget mauris pharetra et.</p>
          <p>Non tellus orci ac auctor augue.</p>
          <p>Elit at imperdiet dui accumsan sit.</p>
          <p>Ornare arcu dui vivamus arcu felis.</p>
          <p>Egestas integer eget aliquet nibh praesent.</p>
          <p>In hac habitasse platea dictumst quisque sagittis purus.</p>
          <p>Pulvinar elementum integer enim neque volutpat ac.</p>
          <p>Senectus et netus et malesuada.</p>
          <p>Nunc pulvinar sapien et ligula ullamcorper malesuada proin.</p>
          <p>Neque convallis a cras semper auctor.</p>
          <p>Libero id faucibus nisl tincidunt eget.</p>
          <p>Leo a diam sollicitudin tempor id.</p>
          <p>A lacus vestibulum sed arcu non odio euismod lacinia.</p>
          <p>In tellus integer feugiat scelerisque.</p>
          <p>Feugiat in fermentum posuere urna nec tincidunt praesent.</p>
        </div>
      </section>
      <section class="text-content right" data-scroll>
        <div class="image-container right" data-scroll>
          <img src="https://v-llage.s3.ap-northeast-2.amazonaws.com/1669707438698_%ED%81%B4%EB%A6%AC%EC%85%B0.png" alt="right Image" />
        </div>
        <div class="text-box left">
          <h1 id="subtitle">Lorem ipsum</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
          <p>Nisl tincidunt eget nullam non.</p>
          <p>Quis hendrerit dolor magna eget est lorem ipsum dolor sit.</p>
          <p>Volutpat odio facilisis mauris sit amet massa.</p>
          <p>Commodo odio aenean sed adipiscing diam donec adipiscing tristique.</p>
          <p>Mi eget mauris pharetra et.</p>
          <p>Non tellus orci ac auctor augue.</p>
          <p>Elit at imperdiet dui accumsan sit.</p>
          <p>Ornare arcu dui vivamus arcu felis.</p>
          <p>Egestas integer eget aliquet nibh praesent.</p>
          <p>In hac habitasse platea dictumst quisque sagittis purus.</p>
          <p>Pulvinar elementum integer enim neque volutpat ac.</p>
          <p>Senectus et netus et malesuada.</p>
          <p>Nunc pulvinar sapien et ligula ullamcorper malesuada proin.</p>
          <p>Neque convallis a cras semper auctor.</p>
          <p>Libero id faucibus nisl tincidunt eget.</p>
          <p>Leo a diam sollicitudin tempor id.</p>
          <p>A lacus vestibulum sed arcu non odio euismod lacinia.</p>
          <p>In tellus integer feugiat scelerisque.</p>
          <p>Feugiat in fermentum posuere urna nec tincidunt praesent.</p>
        </div>
      </section>
      <section class="text-content left" data-scroll>
        <div class="image-container left" data-scroll>
          <img src="https://velog.velcdn.com/images%2Fhing%2Fpost%2Fd06f8ff0-f27b-497e-9d5f-06a6706e0d59%2Fimage.png" alt="Left Image" />
        </div>
        <div class="text-box right">
          <h1 id="subtitle">Lorem ipsum</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
          <p>Nisl tincidunt eget nullam non.</p>
          <p>Quis hendrerit dolor magna eget est lorem ipsum dolor sit.</p>
          <p>Volutpat odio facilisis mauris sit amet massa.</p>
          <p>Commodo odio aenean sed adipiscing diam donec adipiscing tristique.</p>
          <p>Mi eget mauris pharetra et.</p>
          <p>Non tellus orci ac auctor augue.</p>
          <p>Elit at imperdiet dui accumsan sit.</p>
          <p>Ornare arcu dui vivamus arcu felis.</p>
          <p>Egestas integer eget aliquet nibh praesent.</p>
          <p>In hac habitasse platea dictumst quisque sagittis purus.</p>
          <p>Pulvinar elementum integer enim neque volutpat ac.</p>
          <p>Senectus et netus et malesuada.</p>
          <p>Nunc pulvinar sapien et ligula ullamcorper malesuada proin.</p>
          <p>Neque convallis a cras semper auctor.</p>
          <p>Libero id faucibus nisl tincidunt eget.</p>
          <p>Leo a diam sollicitudin tempor id.</p>
          <p>A lacus vestibulum sed arcu non odio euismod lacinia.</p>
          <p>In tellus integer feugiat scelerisque.</p>
          <p>Feugiat in fermentum posuere urna nec tincidunt praesent.</p>
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
   width: 600px;
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
 }

 .text-box.left {
   text-align: left;
 }

 .text-box.right {
   text-align: right;
 }

 .text-content.left {
   flex-direction: row; /* 이미지를 왼쪽에, 텍스트를 오른쪽에 */
 }

 .text-content.right {
   flex-direction: row-reverse; /* 이미지를 오른쪽에, 텍스트를 왼쪽에 */
 }

</style>
