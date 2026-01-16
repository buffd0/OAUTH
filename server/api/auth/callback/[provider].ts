// server/api/auth/callback/[provider].ts (개념 예시)
export default defineEventHandler(async (event) => {
  // 1. 소셜 서비스로부터 유저 정보(email, name) 획득
  const { email, name } = await getSocialUserInfo(event);

  // 2. DB에서 해당 이메일 유저 찾기
  let user = await prisma.user.findUnique({ where: { email } });

  // 3. 없으면 자동 회원가입 (비밀번호 없이)
  if (!user) {
    user = await prisma.user.create({
      data: { email, name } 
    });
  }

  // 4. 기존과 동일하게 쿠키 굽기 (user_name 등)
  setCookie(event, 'user_name', user.name, { path: '/', httpOnly: false });
  
  return sendRedirect(event, '/');
});