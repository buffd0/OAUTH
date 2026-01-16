<script setup>
const route = useRoute()
const router = useRouter()
const token = useCookie('auth_token') 

// 게시글 데이터 가져오기
const { data: post, pending } = await useFetch(`/api/posts/${route.params.id}`)

const goBack = () => {
  router.push('/')
}

// 삭제 함수 (이름을 handleDelete로 통일)
const handleDelete = async () => {
  let inputPassword = null

  // A. 비회원 글인 경우 (authorId가 없음)
  if (!post.value.authorId) {
    inputPassword = prompt('이 게시글의 비밀번호를 입력해주세요.')
    if (inputPassword === null) return // 취소 누르면 중단
    if (!inputPassword) {
      alert('비밀번호를 입력해야 합니다.')
      return
    }
  } 
  // B. 회원 글인 경우
  else {
    if (!token.value) {
      alert('본인의 글만 삭제할 수 있습니다. 먼저 로그인하세요.')
      return
    }
  }

  if (confirm('정말로 삭제하시겠습니까?')) {
    try {
      await $fetch(`/api/posts/${route.params.id}`, {
        method: 'DELETE',
        body: { password: inputPassword }
      })
      alert('삭제되었습니다.')
      router.push('/')
    } catch (e) {
      alert(e.data?.message || '권한이 없거나 비밀번호가 틀렸습니다.')
    }
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 mt-10">
    <div class="mb-6">
      <button @click="goBack" class="flex items-center text-indigo-600 hover:text-indigo-800 font-bold">
        <span class="mr-2 text-xl">←</span> 목록으로 돌아가기
      </button>
    </div>

    <div v-if="pending" class="text-center py-20">데이터를 불러오는 중입니다...</div>
    
    <div v-else-if="post" class="bg-white shadow-lg border border-gray-200 rounded-xl overflow-hidden">
      <div class="bg-gray-50 p-6 border-b border-gray-200">
        <div class="mb-2">
          <span class="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">
            {{ post.category || '자유게시판' }}
          </span>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ post.title }}</h1>
        <div class="flex justify-between items-center text-sm text-gray-500">
          <span>작성자: <strong class="text-gray-700">{{ post.author?.name || post.guestName || '익명' }}</strong></span>
          <div class="space-x-4">
            <span>{{ new Date(post.createdAt).toLocaleString() }}</span>
            <span>조회수 {{ post.views }}</span>
          </div>
        </div>
      </div>

      <div class="p-8 min-h-[300px] text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
        {{ post.content }}
      </div>

      <div class="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <button @click="goBack" class="px-6 py-2 bg-white border border-gray-300 rounded-lg font-bold hover:bg-gray-100">
          목록보기
        </button>
        
        <div class="space-x-2">
          <button @click="router.push(`/posts/edit/${post.id}`)" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 font-bold">
            수정
          </button>
          <button @click="handleDelete" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-bold shadow-sm">
            삭제
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20 text-gray-500">
      게시글을 찾을 수 없습니다.
    </div>
  </div>
</template>