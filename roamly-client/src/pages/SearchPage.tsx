import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { propertiesApi } from '../api/properties'
import PropertyCard from '../components/property/PropertyCard'
import SearchBar from '../components/ui/SearchBar'
import type { SearchParams, PropertyType } from '../types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <SearchBar />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] bg-gray-200 rounded-xl mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-600 mb-2">Ничего не найдено</p>
          <p className="text-sm text-gray-400">Попробуйте изменить параметры поиска</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-6">
            Найдено {result?.totalCount ?? 0} вариантов
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>

          {result && result.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage(result.pageNumber - 1)}
                disabled={result.pageNumber <= 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-30 hover:bg-gray-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {[...Array(result.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    result.pageNumber === i + 1
                      ? 'bg-rose-500 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(result.pageNumber + 1)}
                disabled={result.pageNumber >= result.totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-30 hover:bg-gray-50"
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
