import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code as string
  const config = useRuntimeConfig()

  // 코드가 없으면 로그인 페이지로 리다이렉트
  if (!code) return sendRedirect(event, '/auth/signin?error=no_code')

  try {
    // 1. 구글 토큰 요청
    const tokenResponse: any = await $fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      body: {
        code,
        client_id: config.public.googleClientId,
        client_secret: config.googleClientSecret, // .env에 이 값이 있는지 꼭 확인!
        redirect_uri: `${config.public.authOrigin}/api/auth/callback/google`,
        grant_type: 'authorization_code',
      }
    })

    // 2. 유저 정보 요청
    const googleUser: any = await $fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
    })

    // 3. DB 저장 (이메일 기준)
    const user = await prisma.user.upsert({
        where: { email: googleUser.email },
        update: { name: googleUser.name },
        create: {
            email: googleUser.email,
            name: googleUser.name,
    // 스키마가 String? 라면 아래 password 줄은 아예 없어도 됩니다.
    },
})

    // 4. 쿠키 설정 (httpOnly: false가 핵심)
    setCookie(event, 'user_name', encodeURIComponent(user.name || '유저'), { 
      path: '/', 
      maxAge: 60 * 60 * 24, 
      httpOnly: false, // 레이아웃에서 읽기 위함
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })

    return sendRedirect(event, '/')

  } catch (error) {
    // 에러 발생 시 콘솔에 상세 내용 출력 (터미널에서 확인 가능)
    console.error('--- Google Login Callback Error ---', error)
    return sendRedirect(event, '/auth/signin?error=callback_failed')
  }
})