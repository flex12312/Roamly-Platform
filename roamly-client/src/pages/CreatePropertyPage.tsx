import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { propertiesApi } from '../api/properties'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { PropertyType, PropertyTypeLabels } from '../types'
import type { CreatePropertyRequest, CreateLocationRequest } from '../types'

export default function CreatePropertyPage() {
  const { user } = useAuth()
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

  if (!user) {
    navigate('/login')
    return null
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-2">Добавить объект</h1>
      <p className="text-sm text-gray-500 mb-8">Расскажите гостям о вашем жилье</p>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2].map((s) => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              s <= step ? 'bg-rose-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateForm('title', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
              placeholder="Уютная квартира в центре"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none resize-none"
              placeholder="Опишите ваше жильё..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Тип жилья</label>
            <select
              value={form.type}
              onChange={(e) => updateForm('type', Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Макс. гостей</label>
              <input
                type="number"
                min={1}
                value={form.maxGuests}
                onChange={(e) => updateForm('maxGuests', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Цена / ночь (₽)
              </label>
              <input
                type="number"
                min={0}
                value={form.pricePerNight}
                onChange={(e) => updateForm('pricePerNight', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Спальни</label>
              <input
                type="number"
                min={0}
                value={form.bedrooms}
                onChange={(e) => updateForm('bedrooms', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ванные</label>
              <input
                type="number"
                min={0}
                value={form.bathrooms}
                onChange={(e) => updateForm('bathrooms', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
          <button
            onClick={() => setStep(2)}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Далее → Локация
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Страна</label>
              <input
                type="text"
                value={location.country}
                onChange={(e) => updateLocation('country', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                placeholder="Россия"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Город</label>
              <input
                type="text"
                value={location.city}
                onChange={(e) => updateLocation('city', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                placeholder="Москва"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Улица</label>
              <input
                type="text"
                value={location.street}
                onChange={(e) => updateLocation('street', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                placeholder="Пушкина"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Номер дома</label>
              <input
                type="text"
                value={location.houseNumber}
                onChange={(e) => updateLocation('houseNumber', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                placeholder="10"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              ← Назад
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {loading ? 'Создание...' : 'Создать объект'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
