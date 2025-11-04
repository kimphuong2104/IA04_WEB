import axios, { AxiosInstance, AxiosResponse } from 'axios'

const API_URL = import.meta.env.VITE_API_URL

let accessToken: string | null = null
let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function getAccessToken() {
  return accessToken
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token))
  refreshSubscribers = []
}

function addRefreshSubscriber(cb: (token: string) => void) {
  refreshSubscribers.push(cb)
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})

apiClient.interceptors.request.use((config: any) => {
  if (!config.headers) config.headers = {}
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`
  }
  return config
})

apiClient.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (err) => {
    const originalRequest = err.config
    if (err.response && err.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        // no refresh token -> logout
        localStorage.removeItem('refreshToken')
        setAccessToken(null)
        window.location.href = '/login'
        return Promise.reject(err)
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            resolve(apiClient(originalRequest))
          })
        })
      }

      isRefreshing = true
      try {
        const resp = await axios.post(`${API_URL}/auth/refresh`, { refreshToken })
        const newAccessToken = resp.data.accessToken
        setAccessToken(newAccessToken)
        onRefreshed(newAccessToken)
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      } catch (refreshErr) {
        // refresh failed -> logout
        localStorage.removeItem('refreshToken')
        setAccessToken(null)
        window.location.href = '/login'
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(err)
  },
)

export default apiClient
