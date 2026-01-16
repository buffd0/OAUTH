// server/api/posts/index.get.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // 최신순으로 게시글을 가져오며, 작성자의 이름(name)도 함께 포함(include)합니다.
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { name: true }
      }
    }
  })
  return posts
})