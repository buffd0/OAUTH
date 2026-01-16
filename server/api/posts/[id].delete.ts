import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

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

  // A. 회원(로그인 유저)이 쓴 글인 경우
  if (post.authorId) {
    // 소셜 로그인 확인
    if (socialName && post.guestName === decodeURIComponent(socialName)) {
      isAuthorized = true
    } 
    // 일반 로그인 확인
    else if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any
        if (post.authorId === decoded.userId) isAuthorized = true
      } catch (e) { /* 인증 실패 */ }
    }
    
    // 회원글인데 본인이 아니면 즉시 차단
    if (!isAuthorized) {
      throw createError({ statusCode: 403, message: '본인만 삭제할 수 있는 게시글입니다.' })
    }
  } 
  
  // B. 비회원(익명)이 쓴 글인 경우
  else {
    // 전달받은 비밀번호와 DB 비밀번호 비교
    if (body.password && post.password === body.password) {
      isAuthorized = true
    } else {
      throw createError({ statusCode: 403, message: '비밀번호가 틀렸습니다.' })
    }
  }

  // 3. 최종 삭제 실행
  await prisma.post.delete({ where: { id } })
  
  return { success: true }
})