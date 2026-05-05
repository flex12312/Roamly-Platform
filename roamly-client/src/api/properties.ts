import { housingApi, searchApi } from './client'
import type {
  Property,
  SearchResponse,
  SearchParams,
  CreatePropertyRequest,
  CreateLocationRequest,
  Amenity,
  HouseRules,
  PropertyPhoto,
} from '../types'

export const propertiesApi = {
  search: (params: SearchParams) =>
    searchApi.get<SearchResponse>('/Search', { params }),

  getAll: () => housingApi.get<Property[]>('/Property'),

  getById: (id: number) => housingApi.get<Property>(`/Property/${id}`),

  create: (data: CreatePropertyRequest) =>
    housingApi.post<Property>('/Property', data),

  update: (id: number, data: Partial<CreatePropertyRequest>) =>
    housingApi.put<Property>(`/Property/${id}`, data),

  delete: (id: number) => housingApi.delete(`/Property/${id}`),

  addLocation: (id: number, data: CreateLocationRequest) =>
    housingApi.put<Property>(`/Property/${id}/location`, data),

  getPhotos: (propertyId: number) =>
    housingApi.get<PropertyPhoto[]>(`/Property/${propertyId}/photos`),

  uploadPhoto: (propertyId: number, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return housingApi.post<PropertyPhoto>(
      `/Property/${propertyId}/photos`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  },

  deletePhoto: (propertyId: number, photoId: number) =>
    housingApi.delete(`/Property/${propertyId}/photos/${photoId}`),

  setPrimaryPhoto: (propertyId: number, photoId: number) =>
    housingApi.put(`/Property/${propertyId}/photos/${photoId}/primary`),

  getAllAmenities: () => housingApi.get<Amenity[]>('/Amenities'),

  getPropertyAmenities: (propertyId: number) =>
    housingApi.get<Amenity[]>(`/Amenities/property/${propertyId}/amenities`),

  addAmenities: (propertyId: number, amenityIds: number[]) =>
    housingApi.post(`/Amenities/property/${propertyId}`, amenityIds),

  removeAmenity: (propertyId: number, amenityId: number) =>
    housingApi.delete(`/Amenities/property/${propertyId}/${amenityId}`),

  getHouseRules: (propertyId: number) =>
    housingApi.get<HouseRules>(`/HouseRules/property/${propertyId}/houseRules`),

  updateHouseRules: (
    propertyId: number,
    data: Omit<HouseRules, 'id'>
  ) => housingApi.put(`/HouseRules/property/${propertyId}`, data),
}
