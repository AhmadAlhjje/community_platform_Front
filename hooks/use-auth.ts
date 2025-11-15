import { useAuthStore } from '@/lib/store/auth-store'
import { apiClient } from '@/lib/api-client'
import { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/api'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore()
  const { toast } = useToast()
  const router = useRouter()

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiClient.post<AuthResponse>(
        '/api/auth/login',
        credentials
      )
      setAuth(response.user, response.token)
      toast({
        title: 'Success',
        description: 'Logged in successfully',
        variant: 'success',
      })
      router.push('/dashboard')
      return response
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Login failed',
        variant: 'destructive',
      })
      throw error
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      const response = await apiClient.post<AuthResponse>(
        '/api/auth/register',
        data
      )
      setAuth(response.user, response.token)
      toast({
        title: 'Success',
        description: 'Account created successfully',
        variant: 'success',
      })
      router.push('/dashboard')
      return response
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Registration failed',
        variant: 'destructive',
      })
      throw error
    }
  }

  const logout = () => {
    clearAuth()
    toast({
      title: 'Success',
      description: 'Logged out successfully',
      variant: 'success',
    })
    router.push('/auth/login')
  }

  const getProfile = async () => {
    try {
      const response = await apiClient.get<{ user: User }>(
        '/api/auth/profile',
        true
      )
      return response.user
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch profile',
        variant: 'destructive',
      })
      throw error
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    getProfile,
  }
}
