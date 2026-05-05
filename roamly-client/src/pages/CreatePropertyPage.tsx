import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { propertiesApi } from '../api/properties'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { PropertyType, PropertyTypeLabels } from '../types'
import type { CreatePropertyRequest, CreateLocationRequest } from '../types'
import { Home, MapPin, ChevronRight } from 'lucide-react'

export default function CreatePropertyPage() {
  const { user, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const [form, setForm] = useState<CreatePropertyRequest>({
    title: '',
    description: '',
    type: PropertyType.Apartment,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    pricePerNight: 3000,
    isAvailable: true,
  })

  const [location, setLocation] = useState<CreateLocationRequest>({
    country: '',
    city: '',
    street: '',
    houseNumber: '',
  })

  const updateForm = (field: keyof CreatePropertyRequest, value: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const updateLocation = (field: keyof CreateLocationRequest, value: string) =>
    setLocation((prev) => ({ ...prev, [field]: value }))

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
    }
  }, [authLoading, user, navigate])

  if (authLoading || !user) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg w-1/3" />
          <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
          <div className="h-40 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    )
  }

  const handleSubmit = async () => {
    if (!form.title || !form.description) {
      toast.error('Заполните все обязательные поля')
      return
    }
    setLoading(true)
    try {
      const { data: property } = await propertiesApi.create(form)
      if (location.country && location.city) {
        await propertiesApi.addLocation(property.id, location)
      }
      toast.success('Объект создан!')
      navigate('/host/properties')
    } catch {
      toast.error('Ошибка создания')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">Добавить объект</h1>
        <p className="text-gray-500">Расскажите гостям о вашем жилье</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-3 mb-8">
        {[
          { num: 1, label: 'Основное', icon: Home },
          { num: 2, label: 'Локация', icon: MapPin },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setStep(s.num)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex-1 ${
                step === s.num
                  ? 'bg-brand-50 text-brand-600 border border-brand-200'
                  : s.num < step
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    : 'bg-gray-50 text-gray-400 border border-gray-200'
              }`}
            >
              <s.icon className="w-4 h-4" />
              {s.label}
            </button>
            {i < 1 && <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Название</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateForm('title', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-shadow"
                placeholder="Уютная квартира в центре"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Описание</label>
              <textarea
                value={form.description}
                onChange={(e) => updateForm('description', e.target.value)}
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none transition-shadow"
                placeholder="Опишите ваше жильё..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Тип жилья</label>
              <select
                value={form.type}
                onChange={(e) => updateForm('type', Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-shadow"
              >
                {Object.entries(PropertyTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Макс. гостей</label>
                <input
                  type="number"
                  min={1}
                  value={form.maxGuests}
                  onChange={(e) => updateForm('maxGuests', Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Цена / ночь (₽)
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.pricePerNight}
                  onChange={(e) => updateForm('pricePerNight', Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-shadow"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Спальни</label>
                <input
                  type="number"
                  min={0}
                  value={form.bedrooms}
                  onChange={(e) => updateForm('bedrooms', Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ванные</label>
                <input
                  type="number"
                  min={0}
                  value={form.bathrooms}
                  onChange={(e) => updateForm('bathrooms', Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-shadow"
                />
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-brand-500/25"
            >
              Далее → Локация
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Страна</label>
                <input
                  type="text"
                  value={location.country}
                  onChange={(e) => updateLocation('country', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-shadow"
                  placeholder="Россия"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Город</label>
                <input
                  type="text"
                  value={location.city}
                  onChange={(e) => updateLocation('city', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-shadow"
                  placeholder="Москва"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Улица</label>
                <input
                  type="text"
                  value={location.street}
                  onChange={(e) => updateLocation('street', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-shadow"
                  placeholder="Пушкина"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Номер дома</label>
                <input
                  type="text"
                  value={location.houseNumber}
                  onChange={(e) => updateLocation('houseNumber', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-shadow"
                  placeholder="10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                ← Назад
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-brand-500/25"
              >
                {loading ? 'Создание...' : 'Создать объект'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
