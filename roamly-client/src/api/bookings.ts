import { bookingApi } from './client'
import type { BookingResponse, CreateBookingRequest } from '../types'

export const bookingsApi = {
  create: (data: CreateBookingRequest) =>
    bookingApi.post<BookingResponse>('/Booking', data),

  getById: (id: number) =>
    bookingApi.get<BookingResponse>(`/Booking/${id}`),

  getMy: () =>
    bookingApi.get<BookingResponse[]>('/Booking/my'),

  cancel: (id: number, reason?: string) =>
    bookingApi.post(`/Booking/${id}/cancel`, { reason }),
}
