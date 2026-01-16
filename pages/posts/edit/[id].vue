<script setup>
const route = useRoute()
const router = useRouter()

// 입력 필드 상태 관리
const title = ref('')
const content = ref('')
const category = ref('자유게시판') // 게시판 선택 필드 추가

// 1. 기존 게시글 데이터 불러오기
const { data: post, pending } = await useFetch(`/api/posts/${route.params.id}`)

// 데이터 로드 시 각 입력창에 기존 값 채워넣기
watchEffect(() => {
  if (post.value) {
    title.value = post.value.title
    content.value = post.value.content
    category.value = post.value.category || '자유게시판'
  }
})

// 2. 수정 완료 처리
const handleUpdate = async () => {
  if (!title.value || !content.value) {
    alert('제목과 내용을 입력해주세요.')
    return
  }

  let password = ''
  // 비회원 글인 경우에만 비밀번호 묻기
  if (!post.value.authorId) {
    password = prompt('게시글 수정 비밀번호를 입력하세요.')
    if (!password) return // 취소 시 중단
  }

  try {
    // 서버 API 호출 (수정된 카테고리 포함)
    await $fetch('/api/posts/update-post', {
      method: 'POST',
      body: { 
        id: route.params.id, 
        title: title.value, 
        content: content.value, 
        category: category.value, // 게시판 선택 값 전송
        password: password 
      }
    })
    
    alert('성공적으로 수정되었습니다!')
    router.push(`/posts/${route.params.id}`) // 수정 후 상세 페이지로 이동
  } catch (e) {
    alert(e.data?.message || '수정 권한이 없거나 오류가 발생했습니다.')
  }
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 mt-10">
    <div v-if="pending" class="text-center py-20">데이터를 불러오는 중입니다...</div>
    
    <div v-else class="bg-white shadow-lg border border-gray-200 rounded-xl overflow-hidden">
      <div class="bg-gray-50 p-6 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-900">게시글 수정</h1>
      </div>

      <div class="p-8 space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">게시판 선택</label>
          <select 
            v-model="category" 
            class="w-full p-3 border border-gray-300 rounded-lg outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option>공지사항</option>
            <option>자유게시판</option>
            <option>정보공유</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">제목</label>
          <input 
            v-model="title" 
            type="text" 
            placeholder="제목을 입력하세요"
            class="w-full p-3 border border-gray-300 rounded-lg outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">내용</label>
          <textarea 
            v-model="content" 
            rows="12" 
            placeholder="내용을 입력하세요"
            class="w-full p-3 border border-gray-300 rounded-lg outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>
      </div>

      <div class="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
        <button 
          @click="goBack" 
          class="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-100 transition-colors"
        >
          취소
        </button>
        <button 
          @click="handleUpdate" 
          class="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-700 transition-colors"
        >
          수정완료
        </button>
      </div>
    </div>
  </div>
</template>