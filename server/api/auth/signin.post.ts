import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw createError({ statusCode: 401, message: '등록되지 않은 이메일입니다.' })

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw createError({ statusCode: 401, message: '비밀번호가 틀렸습니다.' })

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1d' }
  )

  // 핵심 수정: httpOnly를 false로 설정해야 브라우저에서 읽힙니다.
setCookie(event, 'auth_token', token, {
  maxAge: 60 * 60 * 24,
  path: '/',
  httpOnly: false
})

setCookie(event, 'user_name', user.name, {
  maxAge: 60 * 60 * 24,
  path: '/',
  httpOnly: false // 브라우저가 읽을 수 있어야 함
})

return { success: true, user: { name: user.name } }
})