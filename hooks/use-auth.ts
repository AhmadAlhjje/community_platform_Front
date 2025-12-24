import { useAuthStore } from '@/lib/store/auth-store'
import { apiClient } from '@/lib/api-client'
import { AuthResponse, LoginRequest, RegisterRequest, VerifyOTPRequest, ResendOTPRequest, User } from '@/types/api'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore()
  const { toast } = useToast()
  const router = useRouter()

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiClient.post<AuthResponse>(
        '/api/auth/login-user',
        credentials
      )

      // Check if login was successful
      if (response.success && response.data) {
        // Save user and token
        setAuth(response.data.user, response.data.token)

        // Show success message
        toast({
          title: 'نجح تسجيل الدخول',
          description: response.message || 'تم تسجيل الدخول بنجاح',
          variant: 'success',
        })

        // Redirect to dashboard
        router.push('/dashboard')

        return response
      } else {
        throw new Error(response.message || 'فشل تسجيل الدخول')
      }
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'فشل تسجيل الدخول',
        variant: 'destructive',
      })
      throw error
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        '/api/auth/register',
        data
      )

      // Check if registration was successful
      if (response.success) {
        // Show success message - OTP sent
        toast({
          title: 'تم إرسال رمز التحقق',
          description: response.message || 'تم إرسال رمز التحقق إلى رقم هاتفك',
          variant: 'success',
        })

        return response
      } else {
        throw new Error(response.message || 'فشل التسجيل')
      }
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'فشل التسجيل',
        variant: 'destructive',
      })
      throw error
    }
  }

  const verifyOTP = async (data: VerifyOTPRequest) => {
    try {
      const response = await apiClient.post<AuthResponse>(
        '/api/auth/verify',
        data
      )

      // Check if verification was successful
      if (response.success && response.data) {
        // Save user and token
        setAuth(response.data.user, response.data.token)

        // Show success message
        toast({
          title: 'تم التحقق بنجاح',
          description: response.message || 'تم إنشاء حسابك بنجاح',
          variant: 'success',
        })

        // Redirect to dashboard
        router.push('/dashboard')

        return response
      } else {
        throw new Error(response.message || 'فشل التحقق من الرمز')
      }
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'فشل التحقق من الرمز',
        variant: 'destructive',
      })
      throw error
    }
  }

  const resendOTP = async (data: ResendOTPRequest) => {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        '/api/auth/resend-otp',
        data
      )

      // Check if resend was successful
      if (response.success) {
        toast({
          title: 'تم إعادة الإرسال',
          description: response.message || 'تم إرسال رمز التحقق مرة أخرى',
          variant: 'success',
        })

        return response
      } else {
        throw new Error(response.message || 'فشل إعادة إرسال الرمز')
      }
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'فشل إعادة إرسال الرمز',
        variant: 'destructive',
      })
      throw error
    }
  }

  const logout = () => {
    clearAuth()
    toast({
      title: 'تم تسجيل الخروج',
      description: 'تم تسجيل الخروج بنجاح',
      variant: 'success',
    })
    // Use window.location.href for full page refresh
    window.location.href = '/'
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
    verifyOTP,
    resendOTP,
    logout,
    getProfile,
  }
}
