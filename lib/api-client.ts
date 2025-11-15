import { APIError } from '@/types/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

class APIClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: APIError = await response.json().catch(() => ({
        message: 'An error occurred',
      }))
      throw error
    }
    return response.json()
  }

  async get<T>(endpoint: string, requiresAuth = false): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (requiresAuth) {
      const token = this.getAuthToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers,
    })

    return this.handleResponse<T>(response)
  }

  async post<T>(
    endpoint: string,
    data?: any,
    requiresAuth = false
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (requiresAuth) {
      const token = this.getAuthToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    })

    return this.handleResponse<T>(response)
  }

  async put<T>(
    endpoint: string,
    data?: any,
    requiresAuth = false
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (requiresAuth) {
      const token = this.getAuthToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    })

    return this.handleResponse<T>(response)
  }

  async delete<T>(endpoint: string, requiresAuth = false): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (requiresAuth) {
      const token = this.getAuthToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers,
    })

    return this.handleResponse<T>(response)
  }
}

export const apiClient = new APIClient(API_URL)
