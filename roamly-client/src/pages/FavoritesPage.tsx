import { useQuery } from '@tanstack/react-query'
import { propertiesApi } from '../api/properties'
import { useFavorites } from '../context/FavoritesContext'
import PropertyCard from '../components/property/PropertyCard'
import { Heart, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { PropertySearchResult } from '../types'

export default function FavoritesPage() {
  const { favorites } = useFavorites()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['search-all-for-favorites'],
    queryFn: () => propertiesApi.search({ pageSize: 100, pageNumber: 1 }),
    enabled: favorites.length > 0,
  })

  const allProperties = data?.data.properties ?? []
  const favoriteProperties: PropertySearchResult[] = allProperties.filter((p) =>
    favorites.includes(p.id),
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Избранное</h1>
        <p className="text-gray-500 mt-1">
          {favorites.length > 0
            ? `${favorites.length} сохранённых вариантов`
            : 'Сохраняйте понравившиеся объекты'}
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Heart className="w-10 h-10 text-brand-300" />
          </div>
          <p className="text-xl font-bold text-gray-900 mb-2">Список пуст</p>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Нажмите на сердечко на любом объекте, чтобы добавить его в избранное.
            Все сохранённые варианты появятся здесь.
          </p>
          <button
            onClick={() => navigate('/search')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-semibold hover:from-brand-600 hover:to-brand-700 transition-all shadow-md shadow-brand-500/25"
          >
            Найти жильё <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(Math.min(favorites.length, 4))].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] bg-gray-200 rounded-2xl mb-3" />
              <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded-lg w-1/2" />
            </div>
          ))}
        </div>
      ) : favoriteProperties.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500">
            Сохранённые объекты больше не доступны в поиске.
          </p>
          <button
            onClick={() => navigate('/search')}
            className="mt-4 text-sm font-semibold text-brand-500 hover:text-brand-600"
          >
            Найти новые варианты →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProperties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  )
}
