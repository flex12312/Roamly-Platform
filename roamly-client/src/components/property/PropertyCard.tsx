import { Link } from 'react-router-dom'
import { MapPin, Users, BedDouble, Bath, Star, Heart } from 'lucide-react'
import { useFavorites } from '../../context/FavoritesContext'
import type { PropertySearchResult } from '../../types'

interface Props {
  property: PropertySearchResult
}

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=60'

export default function PropertyCard({ property }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const saved = isFavorite(property.id)

  return (
    <div className="group relative animate-fade-up">
      <Link to={`/property/${property.id}`} className="block">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3">
          <img
            src={property.mainPhotoUrl || PLACEHOLDER}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {!property.isAvailable && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-white font-semibold text-sm bg-black/60 px-4 py-1.5 rounded-full">
                Недоступно
              </span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="bg-white/95 backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded-full text-gray-800 shadow-sm">
              {property.propertyType}
            </span>
          </div>
        </div>
        <div className="space-y-1.5 px-0.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-semibold text-gray-900 line-clamp-1">
              {property.title}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 fill-gray-900 text-gray-900" />
              <span className="text-sm font-medium">4.9</span>
            </div>
          </div>
          {property.locationName && (
            <div className="flex items-center gap-1 text-gray-500">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="text-sm truncate">{property.locationName}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-gray-400 text-xs">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> {property.maxGuests}
            </span>
            <span className="flex items-center gap-1">
              <BedDouble className="w-3.5 h-3.5" /> {property.bedrooms}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5" /> {property.bathrooms}
            </span>
          </div>
          <p className="text-sm pt-0.5">
            <span className="font-bold text-gray-900">
              ₽{property.pricePerNight.toLocaleString()}
            </span>{' '}
            <span className="text-gray-500">/ ночь</span>
          </p>
        </div>
      </Link>

      {/* Favorite heart button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          toggleFavorite(property.id)
        }}
        className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm transition-all hover:scale-110"
        aria-label={saved ? 'Убрать из избранного' : 'Добавить в избранное'}
      >
        <Heart
          className={`w-[18px] h-[18px] transition-colors ${
            saved
              ? 'fill-brand-500 text-brand-500 animate-heart-pop'
              : 'text-gray-600 hover:text-brand-500'
          }`}
        />
      </button>
    </div>
  )
}
