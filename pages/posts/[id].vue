<script setup>
const route = useRoute()
const router = useRouter()
const socialName = useCookie('user_name')

// 1. 게시글 데이터 가져오기
const { data: post, pending } = await useFetch(`/api/posts/${route.params.id}`)

// 2. 권한 확인 (버튼 노출 여부 결정)
const isMyPost = computed(() => {
  if (!post.value) return false
  if (post.value.authorId) {
    const currentUserName = socialName.value ? decodeURIComponent(socialName.value) : null
    return currentUserName === post.value.author?.name
  }
  return true // 비회원 글은 수정/삭제 버튼 항상 노출
})

const goBack = () => router.push('/')

// 3. 수정 페이지로 이동 (버튼 클릭 시에만 실행됨)
const handleEdit = () => {
  router.push(`/posts/edit/${post.value.id}`)
}

// 4. 삭제 로직
const handleDelete = async () => {
  let password = ''
  if (!post.value.authorId) {
    password = prompt('비밀번호를 입력하세요')
    if (!password) return
  } else {
    if (!confirm('정말로 삭제하시겠습니까?')) return
  }

  try {
    await $fetch(`/api/posts/${route.params.id}`, {
      method: 'DELETE',
      body: { password }
    })
    alert('삭제되었습니다.')
    router.push('/')
  } catch (e) {
    alert(e.data?.message || '권한이 없습니다.')
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 mt-10">
    <div v-if="pending" class="text-center py-20">데이터를 불러오는 중입니다...</div>
    
    <div v-else-if="post" class="bg-white shadow-lg border border-gray-200 rounded-xl overflow-hidden">
      <div class="bg-gray-50 p-6 border-b border-gray-200">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ post.title }}</h1>
        <div class="text-sm text-gray-500">
          작성자: <strong class="text-gray-700">{{ post.author?.name || post.guestName || '익명' }}</strong>
        </div>
      </div>

      <div class="p-8 min-h-[300px] text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
        {{ post.content }}
      </div>

      <div class="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <button @click="goBack" class="px-6 py-2 bg-white border border-gray-300 rounded-lg font-bold">목록보기</button>
        
        <div v-if="isMyPost" class="space-x-2">
          <button @click="handleEdit" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 font-bold hover:bg-gray-100">수정</button>
          <button @click="handleDelete" class="px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600">삭제</button>
        </div>
      </div>
    </div>
  </div>
</template>