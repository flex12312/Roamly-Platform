import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingsApi } from '../api/bookings'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import toast from 'react-hot-toast'
import { BookingStatusLabels, BookingStatus } from '../types'
import { CalendarDays, Users, X } from 'lucide-react'

export default function MyBookingsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingsApi.getMy(),
    enabled: !!user,
  })

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      bookingsApi.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] })
      toast.success('Бронирование отменено')
    },
    onError: () => toast.error('Ошибка отмены'),
  })

  const [cancelId, setCancelId] = useState<number | null>(null)
  const [cancelReason, setCancelReason] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
    }
  }, [authLoading, user, navigate])

  if (authLoading || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-28" />
          ))}
        </div>
      </div>
    )
  }

  const bookings = data?.data ?? []

  const statusColor: Record<BookingStatus, string> = {
    [BookingStatus.Pending]: 'bg-yellow-100 text-yellow-800',
    [BookingStatus.Confirmed]: 'bg-green-100 text-green-800',
    [BookingStatus.Cancelled]: 'bg-red-100 text-red-800',
    [BookingStatus.Completed]: 'bg-blue-100 text-blue-800',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Мои бронирования</h1>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-28" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20">
          <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-gray-600">У вас пока нет бронирований</p>
          <button
            onClick={() => navigate('/search')}
            className="mt-4 px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors text-sm font-medium"
          >
            Найти жильё
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      onClick={() => navigate(`/property/${b.propertyId}`)}
                      className="text-base font-semibold text-gray-900 hover:text-rose-500 transition-colors"
                    >
                      Объект #{b.propertyId}
                    </button>
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColor[b.status]}`}
                    >
                      {BookingStatusLabels[b.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      {format(new Date(b.checkIn), 'd MMM', { locale: ru })} —{' '}
                      {format(new Date(b.checkOut), 'd MMM yyyy', { locale: ru })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" /> {b.guests}
                    </span>
                  </div>
                  {b.cancellationReason && (
                    <p className="text-sm text-red-500 mt-2">
                      Причина отмены: {b.cancellationReason}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold">
                    ₽{b.totalPrice.toLocaleString()}
                  </p>
                  {(b.status === BookingStatus.Pending ||
                    b.status === BookingStatus.Confirmed) && (
                    <button
                      onClick={() => setCancelId(b.id)}
                      className="mt-2 text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Отменить
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      {cancelId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Отменить бронирование</h2>
            <textarea
              placeholder="Причина отмены (необязательно)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm mb-4 outline-none focus:ring-2 focus:ring-rose-500 resize-none h-24"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCancelId(null)
                  setCancelReason('')
                }}
                className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Назад
              </button>
              <button
                onClick={() => {
                  cancelMutation.mutate({
                    id: cancelId,
                    reason: cancelReason || undefined,
                  })
                  setCancelId(null)
                  setCancelReason('')
                }}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
              >
                Отменить бронь
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
