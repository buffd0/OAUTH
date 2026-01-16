import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  const body = await readBody(event)
  const token = getCookie(event, 'auth_token')

  // 1. 게시글 존재 확인
  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) {
    throw createError({ statusCode: 404, message: '글을 찾을 수 없습니다.' })
  }

  // 2. 권한 확인 통합 로직
  if (!post.authorId) {
    // [비로그인 게시글]
    // 비밀번호가 일치하지 않으면 즉시 중단
    if (!body.password || post.password !== body.password) {
      throw createError({ statusCode: 403, message: '비밀번호가 일치하지 않습니다.' })
    }
  } else {
    // [로그인 사용자 게시글]
    if (!token) {
      throw createError({ statusCode: 401, message: '로그인이 필요합니다.' })
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any
      if (post.authorId !== decoded.userId) {
        throw createError({ statusCode: 403, message: '본인의 글만 삭제할 수 있습니다.' })
      }
    } catch (e) {
      throw createError({ statusCode: 401, message: '인증이 만료되었습니다. 다시 로그인해주세요.' })
    }
  }

  // 3. 모든 검증을 통과한 경우에만 삭제 실행
  await prisma.post.delete({ where: { id } })
  
  return { success: true }
})