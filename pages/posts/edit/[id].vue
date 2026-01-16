<script setup>
const route = useRoute()
const router = useRouter()
const socialName = useCookie('user_name')
const token = useCookie('auth_token')

const title = ref('')
const content = ref('')
const category = ref('자유게시판')

// 1. 기존 게시글 데이터 불러오기
const { data: post } = await useFetch(`/api/posts/${route.params.id}`)

// 데이터가 로드되면 ref에 값 할당
watchEffect(() => {
  if (post.value) {
    title.value = post.value.title
    content.value = post.value.content
    category.value = post.value.category || '자유게시판'
    
    // 권한 체크: 내 글이 아니면 쫓아내기
    const currentUserName = socialName.value ? decodeURIComponent(socialName.value) : null
    const postAuthor = post.value.author?.name || post.value.guestName
    if (currentUserName !== postAuthor) {
      alert('본인의 글만 수정할 수 있습니다.')
      router.push('/')
    }
  }
})

const goBack = () => {
  router.back() // 이전 상세 페이지로 이동
}

const handleUpdate = async () => {
  try {
    // 수정 포인트: API 경로를 명확하게 지정
    await $fetch('/api/posts/update-post', {
      method: 'PATCH',
      body: { 
        id: route.params.id, // ID를 body에 포함
        title: title.value, 
        content: content.value, 
        category: category.value 
      }
    })
    
    alert('수정되었습니다!')
    // API 호출이 아니라 '페이지 이동'을 위해 router.push 사용
    router.push(`/posts/${route.params.id}`) 
  } catch (e) {
    console.error(e)
    alert('수정 중 오류가 발생했습니다.')
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 mt-10">
    <div class="bg-white shadow-lg border border-gray-200 rounded-xl overflow-hidden">
      <div class="bg-gray-50 p-6 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-900">게시글 수정</h1>
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
          <input v-model="title" type="text" class="w-full p-3 border border-gray-300 rounded-lg outline-none">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">내용</label>
          <textarea v-model="content" rows="12" class="w-full p-3 border border-gray-300 rounded-lg outline-none"></textarea>
        </div>
      </div>

      <div class="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
        <button @click="goBack" class="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-100">
          취소
        </button>
        <button @click="handleUpdate" class="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-md">
          수정완료
        </button>
      </div>
    </div>
  </div>
</template>