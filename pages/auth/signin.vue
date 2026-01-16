<script setup>
const email = ref('')
const password = ref('')
const config = useRuntimeConfig() // config 선언 위치를 상단으로 올리는 것이 좋습니다.

// 기존 이메일 로그인 로직
const handleSignin = async () => {
  try {
    const response = await $fetch('/api/auth/signin', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    if (response.success) {
      alert('로그인 성공!')
      window.location.href = '/'
    }
  } catch (e) {
    alert(e.data?.message || '로그인 실패')
  }
}

// 1. 구글 로그인 호출
const loginWithGoogle = () => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
  const options = {
    redirect_uri: `${config.public.authOrigin}/api/auth/callback/google`,
    client_id: config.public.googleClientId, 
    access_type: 'offline',
    response_type: 'code', // <-- 끝에 쉼표 추가
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  }
  const qs = new URLSearchParams(options)
  window.location.href = `${rootUrl}?${qs.toString()}`
} // <-- 세미콜론(;)이나 빈칸으로 종료 (기존 코드에 있던 ',' 제거)

// 2. 네이버 로그인 호출
const loginWithNaver = () => {
  const rootUrl = 'https://nid.naver.com/oauth2.0/authorize'
  const options = {
    response_type: 'code',
    client_id: config.public.naverClientId,
    redirect_uri: `${config.public.authOrigin}/api/auth/callback/naver`,
    state: 'random_string_123',
  }
  const qs = new URLSearchParams(options)
  window.location.href = `${rootUrl}?${qs.toString()}`
} // <-- 세미콜론(;)이나 빈칸으로 종료 (기존 코드에 있던 ',' 제거)
</script>

<template>
  <div class="max-w-md mx-auto mt-20 p-8 bg-white shadow-lg rounded-xl border">
    <h1 class="text-2xl font-bold mb-6 text-center">로그인</h1>
    <div class="space-y-4">
      <input v-model="email" type="email" placeholder="이메일" class="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
      <input v-model="password" type="password" placeholder="비밀번호" class="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
      <button @click="handleSignin" class="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition-all">
        로그인
      </button>

      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center"><span class="w-full border-t"></span></div>
        <div class="relative flex justify-center text-xs uppercase"><span class="bg-white px-2 text-gray-500">또는 소셜 로그인</span></div>
      </div>

      <div class="space-y-2">
        <button @click="loginWithGoogle" class="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 p-3 rounded-lg font-medium hover:bg-gray-50 transition-all">
          <img src="https://www.google.com/favicon.ico" class="w-5 h-5" />
          Google로 시작하기
        </button>

        <button @click="loginWithNaver" class="w-full flex items-center justify-center gap-3 bg-[#03C75A] text-white p-3 rounded-lg font-medium hover:opacity-90 transition-all">
          <span class="font-bold">N</span>
          네이버로 시작하기
        </button>
      </div>

      <div class="text-center text-sm text-gray-500 mt-4">
        계정이 없으신가요? <NuxtLink to="/signup" class="text-indigo-600 hover:underline">회원가입</NuxtLink>
      </div>
    </div>
  </div>
</template>