import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingsApi } from '../api/bookings'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import toast from 'react-hot-toast'
import { BookingStatusLabels, BookingStatus } from '../types'
import { CalendarDays, Users, X, MapPin, ArrowRight } from 'lucide-react'

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
            <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-32" />
          ))}
        </div>
      </div>
    )
  }

  const bookings = data?.data ?? []

  const statusStyle: Record<BookingStatus, { bg: string; dot: string }> = {
    [BookingStatus.Pending]: { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
    [BookingStatus.Confirmed]: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
    [BookingStatus.Cancelled]: { bg: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-400' },
    [BookingStatus.Completed]: { bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-400' },
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Мои бронирования</h1>
        <p className="text-gray-500 mt-1">Управляйте своими поездками</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-32" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-lg font-medium text-gray-600">У вас пока нет бронирований</p>
          <p className="text-sm text-gray-400 mt-1 mb-6">Найдите идеальное жильё и забронируйте</p>
          <button
            onClick={() => navigate('/search')}
            className="px-8 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-semibold hover:from-brand-600 hover:to-brand-700 transition-all shadow-md shadow-brand-500/25"
          >
            Найти жильё
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const style = statusStyle[b.status]
            return (
              <div
                key={b.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <button
                        onClick={() => navigate(`/property/${b.propertyId}`)}
                        className="text-base font-bold text-gray-900 hover:text-brand-500 transition-colors flex items-center gap-1"
                      >
                        Объект #{b.propertyId}
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${style.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                        {BookingStatusLabels[b.status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-5 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-4 h-4 text-gray-400" />
                        {format(new Date(b.checkIn), 'd MMM', { locale: ru })} —{' '}
                        {format(new Date(b.checkOut), 'd MMM yyyy', { locale: ru })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-gray-400" /> {b.guests} гостей
                      </span>
                    </div>
                    {b.cancellationReason && (
                      <p className="text-sm text-red-500 mt-3 bg-red-50 px-3 py-2 rounded-lg">
                        Причина отмены: {b.cancellationReason}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-extrabold text-gray-900">
                      ₽{b.totalPrice.toLocaleString()}
                    </p>
                    {(b.status === BookingStatus.Pending ||
                      b.status === BookingStatus.Confirmed) && (
                      <button
                        onClick={() => setCancelId(b.id)}
                        className="mt-3 text-sm text-red-500 hover:text-red-600 font-semibold flex items-center gap-1 ml-auto"
                      >
                        <X className="w-3.5 h-3.5" /> Отменить
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Cancel Modal */}
      {cancelId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl animate-scale-in">
            <h2 className="text-xl font-bold mb-2">Отменить бронирование</h2>
            <p className="text-sm text-gray-500 mb-5">Это действие нельзя отменить</p>
            <textarea
              placeholder="Причина отмены (необязательно)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-5 outline-none focus:ring-2 focus:ring-brand-500 resize-none h-24 transition-shadow"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCancelId(null)
                  setCancelReason('')
                }}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
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
                className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors"
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
