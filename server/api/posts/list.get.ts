import { PrismaClient } from '@prisma/client' // 이 줄 추가
const prisma = new PrismaClient()            // 이 줄 추가

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = query.category as string

  return await prisma.post.findMany({
    where: { category: category },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' }
  })
})