import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { PropertyTypeLabels } from '../../types'

interface Props {
  compact?: boolean
}

export default function SearchBar({ compact }: Props) {
  const navigate = useNavigate()
  const [propertyType, setPropertyType] = useState<string>('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

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
        className="w-full max-w-2xl mx-auto flex items-center gap-3 border border-gray-300 rounded-full py-3 px-6 shadow-sm hover:shadow-md transition-shadow bg-white"
      >
        <Search className="w-5 h-5 text-rose-500" />
        <div className="text-left flex-1">
          <p className="text-sm font-medium text-gray-900">Найти жильё</p>
          <p className="text-xs text-gray-500">Любой тип · Любая цена</p>
        </div>
      </button>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Тип жилья
          </label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
          >
            <option value="">Любой</option>
            {Object.entries(PropertyTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Цена от
          </label>
          <input
            type="number"
            placeholder="₽0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Цена до
          </label>
          <input
            type="number"
            placeholder="₽∞"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Найти
          </button>
        </div>
      </div>
    </div>
  )
}
