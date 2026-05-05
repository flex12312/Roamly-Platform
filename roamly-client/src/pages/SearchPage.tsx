import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { propertiesApi } from '../api/properties'
import PropertyCard from '../components/property/PropertyCard'
import SearchBar from '../components/ui/SearchBar'
import type { SearchParams, PropertyType } from '../types'
import { ChevronLeft, ChevronRight, SlidersHorizontal, Search } from 'lucide-react'
import { PropertyTypeLabels } from '../types'

const CATEGORIES = [
  { label: 'Все', value: '' },
  { label: 'Квартиры', value: '0' },
  { label: 'Дома', value: '1' },
  { label: 'Виллы', value: '2' },
  { label: 'Хостелы', value: '3' },
  { label: 'Отели', value: '4' },
] as const

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const activeType = searchParams.get('propertyType') || ''

  const params: SearchParams = {
    propertyType: searchParams.get('propertyType')
      ? (Number(searchParams.get('propertyType')) as PropertyType)
      : undefined,
    minPrice: searchParams.get('minPrice')
      ? Number(searchParams.get('minPrice'))
      : undefined,
    maxPrice: searchParams.get('maxPrice')
      ? Number(searchParams.get('maxPrice'))
      : undefined,
    pageNumber: Number(searchParams.get('page') || 1),
    pageSize: 12,
  }

  const { data, isLoading } = useQuery({
    queryKey: ['search', params],
    queryFn: () => propertiesApi.search(params),
  })

  const result = data?.data
  const properties = result?.properties ?? []

  const setPage = (page: number) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', String(page))
    setSearchParams(newParams)
  }

  const setType = (type: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (type) {
      newParams.set('propertyType', type)
    } else {
      newParams.delete('propertyType')
    }
    newParams.delete('page')
    setSearchParams(newParams)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Pills */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setType(cat.value)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              activeType === cat.value
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Inline search */}
      <div className="mb-8">
        <SearchBar />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] bg-gray-200 rounded-2xl mb-3" />
              <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded-lg w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded-lg w-1/3" />
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-xl font-medium text-gray-600 mb-2">Ничего не найдено</p>
          <p className="text-sm text-gray-400 mb-6">Попробуйте изменить параметры поиска</p>
          <button
            onClick={() => navigate('/search')}
            className="text-sm font-semibold text-brand-500 hover:text-brand-600"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              Найдено <span className="font-semibold text-gray-900">{result?.totalCount ?? 0}</span> вариантов
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>

          {result && result.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setPage(result.pageNumber - 1)}
                disabled={result.pageNumber <= 1}
                className="p-2.5 rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-gray-50 hover:shadow-sm transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {[...Array(result.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                    result.pageNumber === i + 1
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'border border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(result.pageNumber + 1)}
                disabled={result.pageNumber >= result.totalPages}
                className="p-2.5 rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-gray-50 hover:shadow-sm transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
