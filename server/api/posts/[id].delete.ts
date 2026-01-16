import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient() // 이 줄이 없어서 에러가 발생했습니다

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  const body = await readBody(event)
  const token = getCookie(event, 'auth_token')
  const socialName = getCookie(event, 'user_name')

  // 1. 게시글 존재 확인
  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) {
    throw createError({ statusCode: 404, message: '글을 찾을 수 없습니다.' })
  }

  // 2. 권한 확인 로직
  let isAuthorized = false

  // A. 소셜 로그인 유저 본인 확인
  if (socialName && post.guestName === decodeURIComponent(socialName)) {
    isAuthorized = true
  } 
  // B. 일반 로그인 유저 본인 확인
  else if (post.authorId && token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any
      if (post.authorId === decoded.userId) isAuthorized = true
    } catch (e) { /* 인증 실패 처리 */ }
  } 
  // C. 비회원 비밀번호 확인
  else if (!post.authorId && body.password) {
    if (post.password === body.password) isAuthorized = true
  }

  if (!isAuthorized) {
    throw createError({ statusCode: 403, message: '삭제 권한이 없거나 비밀번호가 틀렸습니다.' })
  }
  
  if (socialName && post.guestName === decodeURIComponent(socialName)) {
  // 본인 확인 완료
} else {
  // 내 글이 아니면 비밀번호를 묻지 않고 바로 차단
  throw createError({ statusCode: 403, message: '본인만 삭제할 수 있는 게시글입니다.' })
}

  // 3. 삭제 실행
  await prisma.post.delete({ where: { id } })
  
  return { success: true }
})