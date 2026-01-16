import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  // 조회수 증가 및 데이터 조회
  return await prisma.post.update({
    where: { id: Number(id) },
    data: { views: { increment: 1 } },
    include: { author: { select: { name: true } } }
  })
})