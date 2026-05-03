import { useQuery } from '@tanstack/react-query'
import { propertiesApi } from '../api/properties'
import PropertyCard from '../components/property/PropertyCard'
import SearchBar from '../components/ui/SearchBar'
import { MapPin, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['search-featured'],
    queryFn: () => propertiesApi.search({ pageSize: 8, pageNumber: 1 }),
  })

  const properties = data?.data.properties ?? []

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-rose-50 via-white to-pink-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Найдите идеальное{' '}
            <span className="text-rose-500">жильё</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Откройте для себя уникальные места для проживания по всему миру. 
            От уютных квартир до роскошных вилл.
          </p>
          <div className="max-w-3xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Локации по всему миру</h3>
              <p className="text-sm text-gray-500">
                Тысячи вариантов жилья в самых популярных направлениях
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Безопасные бронирования</h3>
              <p className="text-sm text-gray-500">
                Защищённые платежи и проверенные хосты
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Мгновенное подтверждение</h3>
              <p className="text-sm text-gray-500">
                Получайте подтверждение бронирования за секунды
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Популярные варианты</h2>
              <p className="text-sm text-gray-500 mt-1">Лучшие предложения прямо сейчас</p>
            </div>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200 rounded-xl mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">Пока нет доступных объектов</p>
              <p className="text-sm mt-1">Объекты появятся здесь после публикации</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
