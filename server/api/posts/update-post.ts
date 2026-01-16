// server/api/update-post.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const socialName = getCookie(event, 'user_name')

  // 1. 권한 확인
  const post = await prisma.post.findUnique({ where: { id: Number(body.id) } })
  if (!post) throw createError({ statusCode: 404, message: '글이 없습니다.' })

  const currentUserName = socialName ? decodeURIComponent(socialName) : null
  if (post.guestName !== currentUserName) {
    throw createError({ statusCode: 403, message: '수정 권한이 없습니다.' })
  }

  // 2. 업데이트
  return await prisma.post.update({
    where: { id: Number(body.id) },
    data: {
      title: body.title,
      content: body.content,
      category: body.category
    }
  })
})