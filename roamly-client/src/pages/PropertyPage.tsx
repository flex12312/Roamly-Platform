import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { propertiesApi } from '../api/properties'
import { bookingsApi } from '../api/bookings'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import toast from 'react-hot-toast'
import {
  MapPin, Users, BedDouble, Bath, ChevronLeft, ChevronRight,
  Cigarette, Dog, Baby, Clock, Check, X, Heart, Star, Share2, Shield,
} from 'lucide-react'
import { PropertyTypeLabels } from '../types'

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&auto=format&fit=crop&q=60'

export default function PropertyPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [photoIndex, setPhotoIndex] = useState(0)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [booking, setBooking] = useState(false)

  const propertyId = Number(id)
  const saved = isFavorite(propertyId)

  const { data, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertiesApi.getById(propertyId),
    enabled: !!id,
  })

  const { data: rulesData } = useQuery({
    queryKey: ['houseRules', id],
    queryFn: () => propertiesApi.getHouseRules(propertyId),
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
      const totalNights = Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
      await bookingsApi.create({
        propertyId,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        guests,
        totalPrice: property!.pricePerNight * totalNights,
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
        <div className="h-8 bg-gray-200 rounded-lg w-1/2 mb-4" />
        <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
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
      ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
      : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Title Row */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {property.title}
          </h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
              {PropertyTypeLabels[property.type] ?? 'Жильё'}
            </span>
            {property.location && (
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="w-3.5 h-3.5" />
                {property.location.city}, {property.location.country}
              </span>
            )}
            <span className="flex items-center gap-1 text-sm text-gray-900 font-medium">
              <Star className="w-3.5 h-3.5 fill-gray-900" />
              4.9
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(propertyId)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-medium ${
              saved
                ? 'border-brand-200 bg-brand-50 text-brand-600'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-brand-500 text-brand-500' : ''}`} />
            {saved ? 'В избранном' : 'Сохранить'}
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              toast.success('Ссылка скопирована!')
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:border-gray-300 text-gray-700 transition-all text-sm font-medium"
          >
            <Share2 className="w-4 h-4" />
            Поделиться
          </button>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="relative aspect-[16/9] sm:aspect-[2.2/1] rounded-2xl overflow-hidden mb-10 bg-gray-100 shadow-lg">
        <img
          src={photos[photoIndex].imageUrl}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        {photos.length > 1 && (
          <>
            <button
              onClick={() => setPhotoIndex((i) => (i > 0 ? i - 1 : photos.length - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-lg transition-all hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPhotoIndex((i) => (i < photos.length - 1 ? i + 1 : 0))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-lg transition-all hover:scale-105"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPhotoIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === photoIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats */}
          <div className="flex items-center gap-8 py-5 border-y border-gray-200">
            {[
              { icon: Users, label: `${property.maxGuests} гостей` },
              { icon: BedDouble, label: `${property.bedrooms} спален` },
              { icon: Bath, label: `${property.bathrooms} ванных` },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2.5 text-gray-700">
                <stat.icon className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Описание</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Удобства</h2>
              <div className="grid grid-cols-2 gap-3">
                {property.amenities.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Check className="w-4 h-4 text-brand-500 shrink-0" />
                    <span className="text-sm text-gray-700">{a.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* House Rules */}
          {rules && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Правила дома</h2>
              <div className="grid grid-cols-2 gap-3">
                <RuleItem icon={<Cigarette className="w-4 h-4" />} label="Курение" allowed={rules.smokingAllowed} />
                <RuleItem icon={<Dog className="w-4 h-4" />} label="Животные" allowed={rules.petsAllowed} />
                <RuleItem icon={<Baby className="w-4 h-4" />} label="Дети" allowed={rules.childrenAllowed} />
                {rules.checkInFrom && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">Заезд с {rules.checkInFrom}</span>
                  </div>
                )}
                {rules.checkOutBefore && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">Выезд до {rules.checkOutBefore}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-xl">
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-2xl font-extrabold text-gray-900">
                ₽{property.pricePerNight.toLocaleString()}
              </span>
              <span className="text-gray-500 text-sm"> / ночь</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 mb-5">
              <Star className="w-3.5 h-3.5 fill-gray-900 text-gray-900" />
              <span className="font-medium text-gray-900">4.9</span>
              <span className="mx-1">·</span>
              <span>12 отзывов</span>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
              <div className="grid grid-cols-2 divide-x divide-gray-200">
                <div className="p-3.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Заезд
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full text-sm mt-1 outline-none font-medium"
                  />
                </div>
                <div className="p-3.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Выезд
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full text-sm mt-1 outline-none font-medium"
                  />
                </div>
              </div>
              <div className="border-t border-gray-200 p-3.5">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Гости
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full text-sm mt-1 outline-none font-medium"
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
              className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 text-[15px]"
            >
              {!property.isAvailable
                ? 'Недоступно'
                : booking
                  ? 'Бронирование...'
                  : 'Забронировать'}
            </button>

            {nights > 0 && (
              <div className="mt-5 space-y-3 pt-5 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    ₽{property.pricePerNight.toLocaleString()} × {nights} ночей
                  </span>
                  <span className="font-medium">₽{(property.pricePerNight * nights).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Сбор за сервис</span>
                  <span className="font-medium text-green-600">Бесплатно</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-3 border-t border-gray-200">
                  <span>Итого</span>
                  <span>₽{(property.pricePerNight * nights).toLocaleString()}</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mt-5 text-xs text-gray-400">
              <Shield className="w-4 h-4" />
              <span>Оплата защищена Roamly</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function RuleItem({ icon, label, allowed }: { icon: React.ReactNode; label: string; allowed: boolean }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl ${allowed ? 'bg-green-50' : 'bg-red-50'}`}>
      <span className={allowed ? 'text-green-500' : 'text-red-400'}>{icon}</span>
      <span className="text-sm text-gray-700">{label}</span>
      {allowed ? (
        <Check className="w-3.5 h-3.5 text-green-500 ml-auto" />
      ) : (
        <X className="w-3.5 h-3.5 text-red-400 ml-auto" />
      )}
    </div>
  )
}
