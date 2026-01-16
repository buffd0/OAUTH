import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const socialName = getCookie(event, 'user_name')

  const post = await prisma.post.findUnique({ where: { id: Number(body.id) } })
  if (!post) throw createError({ statusCode: 404, message: '글이 없습니다.' })

  let isAuthorized = false

  // [중요] 권한 확인 로직 분기
  if (post.authorId) {
    // A. 회원 글: 로그인한 소셜 닉네임과 작성자 닉네임 대조
    const currentUserName = socialName ? decodeURIComponent(socialName) : null
    if (post.guestName === currentUserName) {
      isAuthorized = true
    }
  } else {
    // B. 비회원 글: 입력받은 비밀번호와 DB 비밀번호 대조
    if (body.password && post.password === body.password) {
      isAuthorized = true
    }
  }

  // 승인되지 않았을 때만 에러 발생
  if (!isAuthorized) {
    throw createError({ 
      statusCode: 403, 
      message: post.authorId ? '본인의 글만 수정할 수 있습니다.' : '비밀번호가 일치하지 않습니다.' 
    })
  }

  // 업데이트 실행
  return await prisma.post.update({
    where: { id: Number(body.id) },
    data: {
      title: body.title,
      content: body.content,
      category: body.category
    }
  })
})