const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, // ESLint 미사용
  devServer: {
    host: '127.0.0.1', // 개발 서버의 호스트를 127.0.0.1로 변경
    port: 8080, // 원하는 포트를 설정 (기본값은 8080)
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = '이상형 월드컵 | Ideal type worldcup';
      return args;
    });
  },
});
