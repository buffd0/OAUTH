<script setup>
const email = ref('')
const password = ref('')

const handleSignin = async () => {
  try {
    const response = await $fetch('/api/auth/signin', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    
    // 서버가 쿠키를 구워줬으므로 바로 이동합니다.
    if (response.success) {
      alert('로그인 성공!')
      // window.location.href를 사용해야 레이아웃이 쿠키를 처음부터 다시 읽습니다.
      window.location.href = '/'
    }
  } catch (e) {
    alert(e.data?.message || '로그인 실패')
  }
}
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
      <div class="text-center text-sm text-gray-500 mt-4">
        계정이 없으신가요? <NuxtLink to="/signup" class="text-indigo-600 hover:underline">회원가입</NuxtLink>
      </div>
    </div>
  </div>
</template>