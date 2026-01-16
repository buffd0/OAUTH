// server/api/auth/callback/naver.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { code, state } = getQuery(event)
  const config = useRuntimeConfig()

  try {
    // 1. 네이버 토큰 요청
    const tokenResponse: any = await $fetch(`https://nid.naver.com/oauth2.0/token`, {
      params: {
        grant_type: 'authorization_code',
        client_id: config.public.naverClientId,
        client_secret: config.naverClientSecret,
        code,
        state
      }
    })

    // 2. 유저 정보 요청
    const naverData: any = await $fetch('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
    })

    // 중요: 네이버는 실제 정보가 naverData.response 안에 들어있습니다.
    const naverUser = naverData.response

    if (!naverUser || !naverUser.email) {
      throw new Error('네이버 유저 정보를 가져오지 못했습니다.')
    }

    // 3. DB 저장 (이메일이 undefined가 되지 않도록 naverUser.email 사용)
    const user = await prisma.user.upsert({
      where: { email: naverUser.email },
      update: { name: naverUser.nickname || naverUser.name },
      create: {
        email: naverUser.email,
        name: naverUser.nickname || naverUser.name,
      },
    })

    // 4. 쿠키 설정 및 리다이렉트
    setCookie(event, 'user_name', encodeURIComponent(user.name || '네이버유저'), { 
      path: '/', 
      httpOnly: false,
      sameSite: 'lax'
    })

    return sendRedirect(event, '/')

  } catch (error) {
    console.error('Naver Login Error:', error)
    return sendRedirect(event, '/auth/signin?error=naver_callback_failed')
  }
})