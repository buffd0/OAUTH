export const useAuth = () => {
  const user = useState('user', () => null)

  const fetchUser = async () => {
    const { data } = await useFetch('/api/auth/me')
    user.value = data.value
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    navigateTo('/auth/signin')
  }

  return { user, fetchUser, logout }
}