import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from '@/types/api'
import { setCookie, getCookie, deleteCookie } from '@/lib/cookies'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
}

const storage = typeof window !== 'undefined' ? localStorage : {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        // Save token in cookies (expires in 30 days)
        setCookie('auth_token', token, 30)
        // Also keep in localStorage for backwards compatibility
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token)
        }
        set({ user, token, isAuthenticated: true })
      },
      clearAuth: () => {
        // Remove token from cookies
        deleteCookie('auth_token')
        // Also remove from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token')
        }
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => storage as any),
    }
  )
)
