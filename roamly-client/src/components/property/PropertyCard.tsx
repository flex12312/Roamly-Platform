import { Link } from 'react-router-dom'
import { MapPin, Users, BedDouble, Bath, Star } from 'lucide-react'
import type { PropertySearchResult } from '../../types'

interface Props {
  property: PropertySearchResult
}

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=60'

export default function PropertyCard({ property }: Props) {
  return (
    <Link to={`/property/${property.id}`} className="group block">
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
        <img
          src={property.mainPhotoUrl || PLACEHOLDER}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!property.isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-black/60 px-3 py-1 rounded-full">
              Недоступно
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full text-gray-700">
            {property.propertyType}
          </span>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 truncate pr-2">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 fill-gray-900 text-gray-900" />
            <span className="text-sm font-medium">4.9</span>
          </div>
        </div>
        {property.locationName && (
          <div className="flex items-center gap-1 text-gray-500">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-sm truncate">{property.locationName}</span>
          </div>
        )}
        <div className="flex items-center gap-3 text-gray-500 text-xs">
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
        <p className="text-sm">
          <span className="font-semibold text-gray-900">
            ₽{property.pricePerNight.toLocaleString()}
          </span>{' '}
          <span className="text-gray-500">/ ночь</span>
        </p>
      </div>
    </Link>
  )
}
