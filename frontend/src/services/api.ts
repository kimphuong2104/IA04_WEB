import apiClient, { setAccessToken } from './axios'

export interface RegisterData {
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export const api = {
  register: (data: RegisterData) => apiClient.post('/user/register', data),
  login: async (data: LoginData) => {
    const resp = await apiClient.post('/auth/login', data)
    // store tokens: access in memory, refresh in localStorage
    setAccessToken(resp.data.accessToken)
    localStorage.setItem('refreshToken', resp.data.refreshToken)
    return resp
  },
  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken) {
      await apiClient.post('/auth/logout', { refreshToken })
    }
    localStorage.removeItem('refreshToken')
    setAccessToken(null)
  },
  me: () => apiClient.get('/user/me'),
}