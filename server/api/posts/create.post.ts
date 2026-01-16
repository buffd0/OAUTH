import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = getCookie(event, 'auth_token')

  let authorId = null

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any
      authorId = decoded.userId
    } catch (e) {
      // 토큰 무효 시 비회원으로 처리
    }
  }

  // 글 생성
  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      category: body.category,
      authorId: authorId, // 회원인 경우 ID 저장 (회원 테이블과 연결)
      // 비회원인 경우에만 guestName을 'asdf'로 고정
      guestName: authorId ? null : 'asdf', 
      password: authorId ? null : body.password
    }
  })

  return post
})