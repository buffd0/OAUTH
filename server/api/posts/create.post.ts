import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = getCookie(event, 'auth_token')
  const socialName = getCookie(event, 'user_name') // 소셜 로그인 사용자 이름 가져오기

  let authorId = null
  let displayName = '익명'

  // 1. 일반 로그인 유저 확인 (JWT)
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any
      authorId = decoded.userId
      // DB에서 유저 이름을 가져오거나 토큰에 포함된 이름을 사용
    } catch (e) { /* 토큰 무효 시 처리 */ }
  }

  // 2. 소셜 로그인 유저 이름 결정
  if (socialName) {
    displayName = decodeURIComponent(socialName) // 소셜 유저 이름 사용
  }

  // 글 생성
  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      category: body.category,
      authorId: authorId, 
      // 수정 포인트: 소셜 로그인 유저는 본인 이름 저장, 비회원은 '익명'
      guestName: (authorId || socialName) ? displayName : '익명', 
      password: (authorId || socialName) ? null : body.password
    }
  })

  return post
})