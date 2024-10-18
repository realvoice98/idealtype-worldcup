<template>
  <div class="mypage-container">
    <div class="mypage-contents">

      <div class="buttons" id="buttons1">
        <img src="@/assets/like.png" class="button main-button" />
        <a v-for="(item, index) in like" :key="index" :href="item.href">
          <img :src="item.src" class="button" />
        </a>
      </div>

      <div class="buttons" id="buttons2">
        <img src="@/assets/bookmark.png" class="button main-button" />
        <a v-for="(item, index) in bookmark" :key="index" :href="item.href">
          <img :src="item.src" class="button" />
        </a>
      </div>

      <div class="buttons" id="buttons3">
        <img src="@/assets/management.png" class="button main-button" />
        <a v-for="(item, index) in myworldcup" :key="index" :href="item.href">
          <img :src="item.src" class="button" />
        </a>
      </div>

    </div>
  </div>
</template>


<script>
export default {
  name: 'MyPage',
  //FIXME: DB데이터 불러오기
  data() {
    return {
      like: [
        { src: "https://img.khan.co.kr/news/2023/12/31/l_2024010101000021800103831.webp", href: "http://localhost:8080/" },
        { src: "https://img.khan.co.kr/news/2023/12/31/l_2024010101000021800103831.webp", href: "http://localhost:8080/" }
      ],
      bookmark: [
        { src: "https://img.khan.co.kr/news/2023/12/31/l_2024010101000021800103831.webp", href: "http://localhost:8080/" },
        { src: "https://img.khan.co.kr/news/2023/12/31/l_2024010101000021800103831.webp", href: "http://localhost:8080/" }
      ],
      myworldcup: [
        { src: "https://img.khan.co.kr/news/2023/12/31/l_2024010101000021800103831.webp", href: "http://localhost:8080/" },
        { src: "https://img.khan.co.kr/news/2023/12/31/l_2024010101000021800103831.webp", href: "http://localhost:8080/" }
      ]
    };
  },
  mounted() {
    this.setupHoverAnimation('buttons1');
    this.setupHoverAnimation('buttons2');
    this.setupHoverAnimation('buttons3');
  },
  methods: {
    /*
    FIXME:
    -목록이 많아도 영역을 벗어나면 그냥 접힘. 수정을 하거나 더보기 버튼을 만들고 따로 페이지를 분리해야할듯
     */
    setupHoverAnimation(buttonGroupId) {
      const buttonsGroup = document.getElementById(buttonGroupId);
      const buttons = buttonsGroup.querySelectorAll('.button:not(.main-button)');

      // mouseenter 이벤트
      const mainButton = buttonsGroup.querySelector('.main-button');
      mainButton.addEventListener('mouseenter', () => {
        buttons.forEach((button, index) => {
          const rowIndex = Math.floor(index / 5); // 5개씩 나누기
          const columnIndex = index % 5; // 열 인덱스
          // 각 버튼을 오른쪽으로 이동
          button.style.transform = `translateX(${(columnIndex + 1) * 50}px) translateY(${rowIndex * 50}px)`; // 메인 버튼 옆에서 시작
          button.style.transition = 'transform 0.5s ease'; // 애니메이션 속도
        });
      });

      //mouseleave 이벤트
      buttonsGroup.addEventListener('mouseleave', () => {
        buttons.forEach((button) => {
          // 마우스가 버튼 그룹에서 벗어나면 버튼을 원래 위치로 되돌림
          button.style.transform = 'translateX(0) translateY(0)'; // 펼쳐지는 방향
        });
      });
    }
  }
}
</script>

<style scoped>
.mypage-container {
  text-align: left;
}

.mypage-contents {
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.buttons {
  display: flex;
  position: relative;
  width: 300px;
  height: 100px;
  margin: 1rem;
}

.button {
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 0;
}

.main-button {
  z-index: 1;
  background-color: white;
}

img {
  width: 50px;
  height: 50px;
}
</style>