<script setup>
// 게시판 카테고리 설정
const categories = ['공지사항', '자유게시판', '정보공유']
const selectedCategory = ref('자유게시판')

// 선택된 카테고리에 맞는 게시글 목록 불러오기
const { data: posts, refresh } = await useFetch('/api/posts/list', {
  query: { category: selectedCategory }
})

// 카테고리 변경 시 데이터 다시 불러오기
watch(selectedCategory, () => {
  refresh()
})
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 mt-6">
    <div class="flex space-x-2 border-b border-gray-200 mb-8">
      <button 
        v-for="cat in categories" 
        :key="cat" 
        @click="selectedCategory = cat"
        :class="[
          'pb-3 px-6 transition-all text-sm font-medium', 
          selectedCategory === cat 
            ? 'border-b-2 border-indigo-600 text-indigo-600' 
            : 'text-gray-500 hover:text-gray-700'
        ]"
      >
        {{ cat }}
      </button>
    </div>

    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">{{ selectedCategory }}</h2>
      <NuxtLink 
        to="/posts/new" 
        class="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 shadow-md transition-all font-bold text-sm"
      >
        새 글 쓰기
      </NuxtLink>
    </div>

    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
          <tr>
            <th class="p-4 border-b font-semibold">제목</th>
            <th class="p-4 border-b w-32 font-semibold">작성자</th>
            <th class="p-4 border-b w-32 font-semibold">작성일</th>
            <th class="p-4 border-b w-20 font-semibold text-center">조회</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr 
            v-for="post in posts" 
            :key="post.id" 
            class="hover:bg-gray-50 transition-colors group"
          >
            <td class="p-4">
              <NuxtLink :to="`/posts/${post.id}`" class="text-gray-900 font-medium group-hover:text-indigo-600">
                {{ post.title }}
              </NuxtLink>
            </td>
            
            <td class="p-4 text-sm">
              <span v-if="post.author" class="text-gray-700 font-semibold">
                {{ post.author.name }}
              </span>
              <span v-else class="text-gray-400">
                {{ post.guestName || 'asdf' }}
              </span>
            </td>

            <td class="p-4 text-sm text-gray-500">
              {{ new Date(post.createdAt).toLocaleDateString() }}
            </td>

            <td class="p-4 text-sm text-gray-500 text-center">
              {{ post.views }}
            </td>
          </tr>

          <tr v-if="!posts || posts.length === 0">
            <td colspan="4" class="p-20 text-center text-gray-400">
              <div class="flex flex-col items-center">
                <span class="text-4xl mb-2">📄</span>
                <p>등록된 게시글이 없습니다.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* 추가적인 스타일이 필요하다면 여기에 작성하세요 */
</style>