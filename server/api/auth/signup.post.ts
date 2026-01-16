import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // 이메일 중복 확인
  const exists = await prisma.user.findUnique({
    where: { email: body.email }
  })

  if (exists) {
    throw createError({ statusCode: 400, message: '이미 존재하는 이메일입니다.' })
  }

  // 비밀번호 암호화
  const hashedPassword = await bcrypt.hash(body.password, 10)

  // 사용자 생성
  const user = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
      password: hashedPassword
    }
  })

  return { message: '회원가입 성공', userId: user.id }
})