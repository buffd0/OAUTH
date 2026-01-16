<script setup>
const email = ref('')
const name = ref('')
const password = ref('')
const router = useRouter()

const handleSignin = async () => {
  try {
    await $fetch('/api/auth/signin', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    
    alert('반갑습니다!')
    // 새로고침을 하면 서버가 바뀐 쿠키를 읽어 레이아웃을 '로그인 상태'로 그려줍니다.
    window.location.href = '/' 
  } catch (e) {
    alert(e.data?.message || '로그인 실패')
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-20 p-8 bg-white shadow-lg rounded-xl border">
    <h1 class="text-2xl font-bold mb-6 text-center">회원가입</h1>
    <div class="space-y-4">
      <input v-model="email" type="email" placeholder="이메일" class="w-full p-3 border rounded-lg">
      <input v-model="name" type="text" placeholder="이름" class="w-full p-3 border rounded-lg">
      <input v-model="password" type="password" placeholder="비밀번호" class="w-full p-3 border rounded-lg">
      <button @click="handleSignup" class="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700">
        가입하기
      </button>
    </div>
  </div>
</template>