export default defineNuxtConfig({
  compatibilityDate: '2026-01-16', // 경고 메시지 해결
  modules: ['@nuxtjs/tailwindcss'],
  // css: ['~/assets/css/main.css'] <- 이 줄이 있다면 일단 삭제하거나 주석 처리하세요.
  runtimeConfig: {
    // 서버에서만 사용하는 비밀값 (Client Secret 등)
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    naverClientSecret: process.env.NAVER_CLIENT_SECRET,
    
    public: {
      // 클라이언트(브라우저)에서도 알 수 있는 값 (Client ID 등)
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      naverClientId: process.env.NAVER_CLIENT_ID,
      authOrigin: process.env.AUTH_ORIGIN || 'http://localhost:3000'
    }
  }
})