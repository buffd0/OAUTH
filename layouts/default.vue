<script setup>
// 쿠키 설정 시 path: '/'를 넣어야 메인과 상세 페이지 모두에서 이름을 읽을 수 있습니다.
const token = useCookie('auth_token', { path: '/' })
const userName = useCookie('user_name', { path: '/' })

const isLoggedIn = computed(() => !!token.value)

const handleLogout = () => {
  token.value = null
  userName.value = null
  alert('로그아웃 되었습니다.')
  window.location.href = '/'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-indigo-900 text-white p-4 shadow-md">
      <div class="max-w-6xl mx-auto flex justify-between items-center">
        <NuxtLink to="/" class="text-2xl font-bold italic tracking-tighter">COMMUNITY</NuxtLink>
        
        <div class="flex items-center space-x-4">
          <template v-if="isLoggedIn">
            <div class="flex items-center space-x-2">
              <span class="bg-indigo-600 px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">User</span>
              <span class="text-sm font-bold text-indigo-100">
                {{ userName || '회원' }}님
              </span>
            </div>
            <button @click="handleLogout" class="bg-indigo-800 hover:bg-indigo-700 px-4 py-1.5 rounded-lg text-sm font-bold transition-all border border-indigo-700">
              로그아웃
            </button>
          </template>
          
          <template v-else>
            <div class="flex space-x-4 text-sm font-medium">
              <NuxtLink to="/auth/signin" class="hover:text-indigo-200">로그인</NuxtLink>
              <NuxtLink to="/auth/signup" class="hover:text-indigo-200">회원가입</NuxtLink>
            </div>
          </template>
        </div>
      </div>
    </nav>

    <main class="py-8">
      <slot />
    </main>
  </div>
</template>