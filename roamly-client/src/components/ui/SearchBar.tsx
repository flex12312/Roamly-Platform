import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import { PropertyTypeLabels } from '../../types'

interface Props {
  compact?: boolean
}

export default function SearchBar({ compact }: Props) {
  const navigate = useNavigate()
  const [propertyType, setPropertyType] = useState<string>('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (propertyType) params.set('propertyType', propertyType)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    navigate(`/search?${params.toString()}`)
  }

  if (compact) {
    return (
      <button
        onClick={() => navigate('/search')}
        className="w-full max-w-2xl mx-auto flex items-center gap-3 border border-gray-200 rounded-full py-3.5 px-6 shadow-sm hover:shadow-lg transition-all bg-white group"
      >
        <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center group-hover:shadow-lg group-hover:shadow-brand-500/25 transition-shadow">
          <Search className="w-4 h-4 text-white" />
        </div>
        <div className="text-left flex-1">
          <p className="text-sm font-semibold text-gray-900">Найти жильё</p>
          <p className="text-xs text-gray-400">Любой тип · Любая цена · Любые даты</p>
        </div>
      </button>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Main search row */}
      <div className="flex items-center">
        <div className="flex-1 flex items-center gap-3 px-6 py-4">
          <Search className="w-5 h-5 text-brand-500 shrink-0" />
          <div className="flex-1">
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full text-sm font-medium text-gray-900 outline-none bg-transparent cursor-pointer"
            >
              <option value="">Любой тип жилья</option>
              {Object.entries(PropertyTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="h-10 w-px bg-gray-200" />

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-5 py-4 text-sm font-medium transition-colors ${
            showFilters ? 'text-brand-500' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Фильтры
        </button>

        <div className="pr-3">
          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-md shadow-brand-500/25 hover:shadow-brand-500/40 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Найти
          </button>
        </div>
      </div>

      {/* Expandable filters */}
      {showFilters && (
        <div className="border-t border-gray-100 px-6 py-4 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Цена от
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₽</span>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl pl-7 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-shadow"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Цена до
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₽</span>
                <input
                  type="number"
                  placeholder="Без ограничений"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl pl-7 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-shadow"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
