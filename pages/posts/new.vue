<script setup>
const title = ref('')
const content = ref('')
const category = ref('자유게시판')
const router = useRouter()

const token = useCookie('auth_token')
const socialName = useCookie('user_name')

// 소셜 이름이나 토큰 중 하나라도 있으면 회원이므로 isGuest는 false
const isGuest = computed(() => !token.value && !socialName.value) 

const password = ref('') 

// 목록으로 이동하는 함수
const goBack = () => {
  router.push('/')
}

const submitPost = async () => {
  if (!title.value || !content.value) {
    alert('제목과 내용을 입력해주세요.')
    return
  }

  if (isGuest.value && !password.value) {
    alert('비회원은 수정을 위한 비밀번호를 입력해야 합니다.')
    return
  }
  
  try {
    await $fetch('/api/posts/create', {
      method: 'POST',
      body: { 
        title: title.value, 
        content: content.value, 
        category: category.value,
        guestName: isGuest.value ? 'asdf' : null,
        password: isGuest.value ? password.value : null
      }
    })
    alert('게시글이 등록되었습니다!')
    router.push('/')
  } catch (e) {
    alert(e.data?.message || '게시글 등록에 실패했습니다.')
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 mt-10">
    <div class="bg-white shadow-lg border border-gray-200 rounded-xl overflow-hidden">
      <div class="bg-gray-50 p-6 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-900">새 글 작성</h1>
      </div>

      <div class="p-8 space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">게시판 선택</label>
          <select v-model="category" class="w-full p-3 border border-gray-300 rounded-lg outline-none">
            <option>공지사항</option>
            <option>자유게시판</option>
            <option>정보공유</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">제목</label>
          <input v-model="title" type="text" placeholder="제목을 입력하세요" class="w-full p-3 border border-gray-300 rounded-lg outline-none">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">내용</label>
          <textarea v-model="content" rows="12" placeholder="내용을 입력하세요" class="w-full p-3 border border-gray-300 rounded-lg outline-none"></textarea>
        </div>

        <div v-if="isGuest" class="p-5 bg-indigo-50 rounded-xl border border-indigo-100">
          <label class="text-sm font-bold text-indigo-900">비회원 비밀번호</label>
          <input v-model="password" type="password" class="w-full max-w-xs p-3 border border-indigo-200 rounded-lg outline-none">
        </div>
      </div>

      <div class="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
        <button 
          type="button"
          @click="goBack" 
          class="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-100 transition-all"
        >
          취소
        </button>
        <button 
          @click="submitPost" 
          class="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md"
        >
          등록하기
        </button>
      </div>
    </div>
  </div>
</template>