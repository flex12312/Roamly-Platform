export interface AuthResponse {
  token: string
  email: string
  userName: string
  expiresAt: string
  refreshToken?: string
}

export interface RegisterRequest {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  birthDate: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface UserInfo {
  id: string
  email: string
  fullName: string
}

export interface LocationResponse {
  id: number
  country: string
  city: string
  street: string
  houseNumber: string
  apartmentNumber?: string
  postalCode?: string
  latitude?: number
  longitude?: number
}

export interface PropertyPhoto {
  id: number
  imageUrl: string
  isMain: boolean
  order: number
}

export interface Amenity {
  id: number
  name: string
  description?: string
  icon?: string
}

export interface HouseRules {
  id: number
  smokingAllowed: boolean
  petsAllowed: boolean
  childrenAllowed: boolean
  checkInFrom?: string
  checkOutBefore?: string
}

export const PropertyType = {
  Apartment: 0,
  House: 1,
  Villa: 2,
  Hostel: 3,
  Hotel: 4,
} as const

export type PropertyType = (typeof PropertyType)[keyof typeof PropertyType]

export const PropertyTypeLabels: Record<PropertyType, string> = {
  [PropertyType.Apartment]: 'Квартира',
  [PropertyType.House]: 'Дом',
  [PropertyType.Villa]: 'Вилла',
  [PropertyType.Hostel]: 'Хостел',
  [PropertyType.Hotel]: 'Отель',
}

export interface Property {
  id: number
  ownerId: string
  title: string
  description: string
  type: PropertyType
  maxGuests: number
  bedrooms: number
  bathrooms: number
  pricePerNight: number
  isAvailable: boolean
  isPublished: boolean
  location?: LocationResponse
  photos: PropertyPhoto[]
  amenities: Amenity[]
  createdAt: string
  lastUpdatedAt?: string
}

export interface PropertySearchResult {
  id: number
  title: string
  description: string
  pricePerNight: number
  locationName: string
  propertyType: string
  maxGuests: number
  bedrooms: number
  bathrooms: number
  mainPhotoUrl?: string
  isAvailable: boolean
  isPublished: boolean
}

export interface SearchResponse {
  properties: PropertySearchResult[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

export interface SearchParams {
  locationId?: number
  minPrice?: number
  maxPrice?: number
  propertyType?: PropertyType
  sortBy?: string
  pageNumber?: number
  pageSize?: number
}

export const BookingStatus = {
  Pending: 0,
  Confirmed: 1,
  Cancelled: 2,
  Completed: 3,
} as const

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus]

export const BookingStatusLabels: Record<BookingStatus, string> = {
  [BookingStatus.Pending]: 'Ожидает',
  [BookingStatus.Confirmed]: 'Подтверждено',
  [BookingStatus.Cancelled]: 'Отменено',
  [BookingStatus.Completed]: 'Завершено',
}

export interface BookingResponse {
  id: number
  propertyId: number
  guestId: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: BookingStatus
  cancellationReason?: string
  createdAt: string
}

export interface CreateBookingRequest {
  propertyId: number
  checkIn: string
  checkOut: string
  guests: number
}

export interface CreatePropertyRequest {
  locationId?: number
  title: string
  description: string
  type: PropertyType
  maxGuests: number
  bedrooms: number
  bathrooms: number
  pricePerNight: number
  isAvailable: boolean
}

export interface CreateLocationRequest {
  country: string
  city: string
  street: string
  houseNumber: string
  apartmentNumber?: string
  postalCode?: string
  latitude?: number
  longitude?: number
}
