/**
 * Cookie utility functions for managing authentication tokens
 */

/**
 * Set a cookie with the given name, value, and optional days to expire
 */
export function setCookie(name: string, value: string, days: number = 30) {
  if (typeof window === 'undefined') return

  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = `expires=${date.toUTCString()}`

  // Set cookie with secure flags
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null

  const nameEQ = `${name}=`
  const cookies = document.cookie.split(';')

  for (let cookie of cookies) {
    cookie = cookie.trim()
    if (cookie.startsWith(nameEQ)) {
      return cookie.substring(nameEQ.length)
    }
  }

  return null
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string) {
  if (typeof window === 'undefined') return

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}
