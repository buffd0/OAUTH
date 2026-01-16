// server/api/auth/me.get.ts
import jwt from 'jsonwebtoken'

export default defineEventHandler((event) => {
  const token = getCookie(event, 'auth_token')
  
  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    return decoded
  } catch (e) {
    return null
  }
})