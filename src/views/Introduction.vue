<template>
  <div class="intro-container">
    <div class="intro-title">
      <h1 id="title"></h1>
    </div>
    <div class="intro-content">
      <section class="text" data-scroll>
        <pre>
          누군가 내게

          "신두형을 얼마나 사랑했나요" 하고 묻는다면,

          나는 외면하며 "손톱만큼이요" 라고 할 것이다

          하지만 돌아서서는,

          잘라내도 잘라내도 평생 자라나고야 마는

          내 손톱을 보고 마음이 저려 펑펑 울지도 모른다
        </pre>
      </section>
      <section class="text" data-scroll>
        <pre>
          버스를 탔을 때,

          기사님이 의아한 표정으로 물었다.

          "학생, 1명인데 왜 2명찍어?"

          "제 마음속에는 언제나 크리스티아노가 살고있기 때문이죠."

          기사 님이 웃으며 말했다.

          "학생, 우리들의 친절한 이웃 크리스티아노는 요금을 안받는단다.
        </pre>
      </section>
      <section class="text" data-scroll>
        <pre>
          진짜 안되겠어요. 저 오늘부로 신두형에 대한 마음 접습니다.
          그 다음에 끝선에 맞추어 다시 반 접습니다.
          뒤로 돌려 양쪽 모두 펼칩니다.
          끝 부분을 살짝 접고선 중심 선에 맞춰 위로 올려 접은 뒤 뒤집으면 예쁜 우리 신두형 하트 접기 완성!!❤️❤️
        </pre>
      </section>
      <section class="text" data-scroll>
        <pre>
          "미국은 어디있지?"
          "북위 24-48, 경도 67-125도,
          북아메리카에."
          "대한민국은?"
          "동경 127도, 북위 37도,
          동북아시아에."
          "호날두는-"
          ".여기, 내 심장에."
        </pre>
      </section>
      <section class="text" data-scroll>
        <pre>
          세상에 70억명의 호날두 팬이 있다면, 나는 그들 중 한 명일 것이다.
          세상에 1억명의 호날두 팬이 있다면., 나 또한 그들 중 한 명일 것이다.
          세상에 천만 명의 호날두 팬이 있다면, 나는 여전히 그들 중 한 명일 것이다.
          세상에 백 명의 호날두 팬이 있다면, 나는 아직도 그들 중 한 명일 것이다.
          세상에 한 명의 호날두 팬이 있다면, 그 사람은 아마도 나일 것이다.
          세상에 단 한 명의 호날두 팬도 없다면, 나는 그제서야 이 세상에 없는 것이다.

          호날두, 나의 사랑.
          호날두, 나의 빛.
          호날두, 나의 어둠.
          호날두, 나의 삶.
          호날두, 나의 기쁨.
          호날두, 나의 슬픔.
          호날두, 나의 고통.
          호날두, 나의 안식.
          호날두, 나.
        </pre>
      </section>
      <section class="text" data-scroll>
        <pre>
          호날두 좋으면 만세 이딴말 왜 하는거임?
          나 그럼 어떡하라고 계속 손들고 있으라고?
          나 그럼 아무것도 못해
          나 그럼 다 허락 맡아야 돼?
          나 그럼 계속 손들고 있어야 되냐고
          나 그럼 밥도 못먹고 화장실도 못가고
          젠장, 또 신두형이야. 이 게시글만 보고 자려고 했는데, 신두형을 보고 말았어. 이제 나는 외쳐야만 해...
          외치면 잠이 확 깨 버릴 걸 알면서도, 나는 외쳐. 그것이 신두형을 목도한 자의 사명이다. 자, 외치겠어.

          SIUUUUUUUUUUUUU!!!!!!!!
        </pre>
      </section>
      <section class="text" data-scroll>
        <pre>
          어제 호날두 카페 다녀왔습니다

          호날두 카페가 열린 건 아니고요

          그냥 카페에서 호날두 생각했습니다

          카페에 간 건 아니고요

          그냥 집에서 커피를 마셨습니다

          사실 커피도 안마셨습니다

          그냥 호날두 상태입니다
        </pre>
      </section>
      <section class="text" data-scroll>
        <pre>
          호날두라는 이름은
          누가 지어냈는지 모르겠어요.



          ˝호…날…두…˝ 하고 불러 보면
          금시로 따스해 오는 내 마음.



          ˝호…날…두˝ 하고 불러 보면
          ˝오오-˝ 하고 들려 오는 듯한 목소리.



          참말 이 세상에서
          하나밖에 없는 이름.



          바위도 오래 되면 깎여지는데
          해같이 달같이 오랠



          호날두의 이름.
        </pre>
      </section>
    </div>
  </div>
</template>

<script>
import TypeIt from "typeit";
import ScrollOut from "scroll-out";

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
        // remove the class
        el.classList.remove("animated");

        // force reflow
        void el.offsetWidth;

        // re-add the animated cl
        el.classList.add("animated");
      }
    });
  },
};
</script>

<style scoped>
 .intro-container{
   padding: 20px;
 }

 .intro-content{
   padding: 10px;
 }

 .text {
   margin-bottom: 500px;
   border-radius: 8px;
   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
</style>
