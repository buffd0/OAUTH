<script setup>
const route = useRoute()
const router = useRouter()
const token = useCookie('auth_token')
const socialName = useCookie('user_name')

// 게시글 데이터 가져오기
const { data: post, pending } = await useFetch(`/api/posts/${route.params.id}`)

// 1. 현재 로그인한 유저의 이름 (쿠키에서 가져옴)
const currentUserName = computed(() => {
  return socialName.value ? decodeURIComponent(socialName.value) : null
})

// 2. 내 게시글인지 확인하는 로직 (작성자 이름 대조)
const isMyPost = computed(() => {
  if (!post.value) return false
  
  // 게시글에 표시된 작성자 이름과 현재 로그인한 이름이 같으면 본인 글임
  const postAuthor = post.value.author?.name || post.value.guestName
  return currentUserName.value === postAuthor
})

const goBack = () => {
  router.push('/')
}

const handleDelete = async () => {
  if (confirm('정말로 삭제하시겠습니까?')) {
    try {
      await $fetch(`/api/posts/${route.params.id}`, {
        method: 'DELETE'
      })
      alert('삭제되었습니다.')
      router.push('/')
    } catch (e) {
      alert(e.data?.message || '삭제 권한이 없습니다.')
    }
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 mt-10">

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
        
        <div v-if="isMyPost" class="space-x-2">
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