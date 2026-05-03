import { identityApi } from './client'
import type { AuthResponse, LoginRequest, RegisterRequest, UserInfo } from '../types'

export const authApi = {
  register: (data: RegisterRequest) =>
    identityApi.post<{ message: string }>('/Auth/register', data),

  login: (data: LoginRequest) =>
    identityApi.post<AuthResponse>('/Auth/login', data),

  refresh: (refreshToken: string) =>
    identityApi.post<AuthResponse>('/Auth/refresh', { refreshToken }),

  me: () => identityApi.get<UserInfo>('/User/me'),
}
