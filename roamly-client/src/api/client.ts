import axios from 'axios'

function createClient(basePath: string) {
  const instance = axios.create({ baseURL: basePath })

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      if (error.response?.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken && !error.config._retry) {
          error.config._retry = true
          try {
            const { data } = await identityApi.post('/Auth/refresh', {
              refreshToken,
            })
            localStorage.setItem('token', data.token)
            if (data.refreshToken) {
              localStorage.setItem('refreshToken', data.refreshToken)
            }
            error.config.headers.Authorization = `Bearer ${data.token}`
            return instance(error.config)
          } catch {
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            window.location.href = '/login'
          }
        }
      }
      return Promise.reject(error)
    }
  )

  return instance
}

export const identityApi = createClient('/api/identity')
export const housingApi = createClient('/api/housing')
export const searchApi = createClient('/api/search')
export const bookingApi = createClient('/api/booking')
