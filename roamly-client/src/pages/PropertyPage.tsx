import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { propertiesApi } from '../api/properties'
import { bookingsApi } from '../api/bookings'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import {
  MapPin,
  Users,
  BedDouble,
  Bath,
  ChevronLeft,
  ChevronRight,
  Cigarette,
  Dog,
  Baby,
  Clock,
  Check,
  X,
} from 'lucide-react'
import { PropertyTypeLabels } from '../types'

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&auto=format&fit=crop&q=60'

export default function PropertyPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [photoIndex, setPhotoIndex] = useState(0)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [booking, setBooking] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertiesApi.getById(Number(id)),
    enabled: !!id,
  })

  const { data: rulesData } = useQuery({
    queryKey: ['houseRules', id],
    queryFn: () => propertiesApi.getHouseRules(Number(id)),
    enabled: !!id,
  })

  const property = data?.data
  const rules = rulesData?.data

  const handleBook = async () => {
    if (!user) {
      toast.error('Войдите, чтобы забронировать')
      navigate('/login')
      return
    }
    if (!checkIn || !checkOut) {
      toast.error('Выберите даты')
      return
    }
    setBooking(true)
    try {
      await bookingsApi.create({
        propertyId: Number(id),
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        guests,
      })
      toast.success('Бронирование создано!')
      navigate('/my-bookings')
    } catch {
      toast.error('Ошибка бронирования')
    } finally {
      setBooking(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="aspect-[16/9] bg-gray-200 rounded-2xl mb-8" />
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-xl text-gray-600">Объект не найден</p>
      </div>
    )
  }

  const photos = property.photos.length > 0 ? property.photos : [{ id: 0, imageUrl: PLACEHOLDER, isMain: true, order: 0 }]
  const nights =
    checkIn && checkOut
      ? Math.max(
          1,
          Math.ceil(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Photo Gallery */}
      <div className="relative aspect-[16/9] sm:aspect-[2/1] rounded-2xl overflow-hidden mb-8 bg-gray-100">
        <img
          src={photos[photoIndex].imageUrl}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        {photos.length > 1 && (
          <>
            <button
              onClick={() => setPhotoIndex((i) => (i > 0 ? i - 1 : photos.length - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white shadow-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPhotoIndex((i) => (i < photos.length - 1 ? i + 1 : 0))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white shadow-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
              {photoIndex + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Details */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <span className="text-sm font-medium text-rose-500">
              {PropertyTypeLabels[property.type] ?? 'Жильё'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              {property.title}
            </h1>
            {property.location && (
              <div className="flex items-center gap-1 text-gray-500 mt-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">
                  {property.location.city}, {property.location.country}
                  {property.location.street && `, ${property.location.street} ${property.location.houseNumber}`}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 py-4 border-y border-gray-200">
            <div className="flex items-center gap-2 text-gray-700">
              <Users className="w-5 h-5" />
              <span className="text-sm">{property.maxGuests} гостей</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <BedDouble className="w-5 h-5" />
              <span className="text-sm">{property.bedrooms} спален</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Bath className="w-5 h-5" />
              <span className="text-sm">{property.bathrooms} ванных</span>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Описание</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {property.amenities.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Удобства</h2>
              <div className="grid grid-cols-2 gap-3">
                {property.amenities.map((a) => (
                  <div key={a.id} className="flex items-center gap-2 text-gray-700">
                    <Check className="w-4 h-4 text-rose-500" />
                    <span className="text-sm">{a.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {rules && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Правила дома</h2>
              <div className="grid grid-cols-2 gap-3">
                <RuleItem
                  icon={<Cigarette className="w-4 h-4" />}
                  label="Курение"
                  allowed={rules.smokingAllowed}
                />
                <RuleItem
                  icon={<Dog className="w-4 h-4" />}
                  label="Животные"
                  allowed={rules.petsAllowed}
                />
                <RuleItem
                  icon={<Baby className="w-4 h-4" />}
                  label="Дети"
                  allowed={rules.childrenAllowed}
                />
                {rules.checkInFrom && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Заезд с {rules.checkInFrom}</span>
                  </div>
                )}
                {rules.checkOutBefore && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Выезд до {rules.checkOutBefore}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
            <div className="mb-4">
              <span className="text-2xl font-bold">
                ₽{property.pricePerNight.toLocaleString()}
              </span>
              <span className="text-gray-500"> / ночь</span>
            </div>

            <div className="border border-gray-300 rounded-xl overflow-hidden mb-4">
              <div className="grid grid-cols-2 divide-x divide-gray-300">
                <div className="p-3">
                  <label className="block text-[10px] font-semibold text-gray-700 uppercase">
                    Заезд
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full text-sm mt-1 outline-none"
                  />
                </div>
                <div className="p-3">
                  <label className="block text-[10px] font-semibold text-gray-700 uppercase">
                    Выезд
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full text-sm mt-1 outline-none"
                  />
                </div>
              </div>
              <div className="border-t border-gray-300 p-3">
                <label className="block text-[10px] font-semibold text-gray-700 uppercase">
                  Гости
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full text-sm mt-1 outline-none"
                >
                  {[...Array(property.maxGuests)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'гость' : i < 4 ? 'гостя' : 'гостей'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleBook}
              disabled={booking || !property.isAvailable}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all"
            >
              {!property.isAvailable
                ? 'Недоступно'
                : booking
                  ? 'Бронирование...'
                  : 'Забронировать'}
            </button>

            {nights > 0 && (
              <div className="mt-4 space-y-2 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    ₽{property.pricePerNight.toLocaleString()} × {nights} ночей
                  </span>
                  <span>₽{(property.pricePerNight * nights).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
                  <span>Итого</span>
                  <span>₽{(property.pricePerNight * nights).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function RuleItem({
  icon,
  label,
  allowed,
}: {
  icon: React.ReactNode
  label: string
  allowed: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={allowed ? 'text-green-500' : 'text-red-400'}>{icon}</span>
      <span className="text-sm text-gray-700">{label}</span>
      {allowed ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <X className="w-3.5 h-3.5 text-red-400" />
      )}
    </div>
  )
}
