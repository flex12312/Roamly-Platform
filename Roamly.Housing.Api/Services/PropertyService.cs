using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Roamly.Housing.Api.Data;
using Roamly.Housing.Api.DTOs.Requests;
using Roamly.Housing.Api.DTOs.Responses;
using Roamly.Housing.Api.Interfaces;
using Roamly.Housing.Api.Models;

namespace Roamly.Housing.Api.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly HousingDbContext _dbContext;
        private readonly IMapper _mapper;
        public PropertyService(HousingDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<PropertyResponseDto?> CreatePropertyAsync(CreatePropertyRequestDto dto, string ownerId)
        {
            if (dto.LocationId.HasValue)
            {
                var location = await _dbContext.Locations.FindAsync(dto.LocationId.Value);
                if (location == null) return null;
            }

            var property = _mapper.Map<Property>(dto);
            property.OwnerId = ownerId;

            _dbContext.Properties.Add(property);
            await _dbContext.SaveChangesAsync();

            return _mapper.Map<PropertyResponseDto>(property);
        }

        public async Task<bool> DeletePropertyAsync(int id, string ownerId)
        {
            var property = await _dbContext.Properties.FindAsync(id);
            if (property == null) return false;

            if (property.OwnerId != ownerId) return false;

            _dbContext.Properties.Remove(property);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<PropertyResponseDto>> GetAllPropertiesAsync()
        {
            var properties = await _dbContext.Properties.Include(p => p.Location).Include(p => p.Photos).Include(p => p.Amenities).Where(p => p.IsPublished).ToListAsync();

            return _mapper.Map<IEnumerable<PropertyResponseDto>>(properties);
        }

        public async Task<PropertyResponseDto?> GetPropertyByIdAsync(int id)
        {
            var property = await _dbContext.Properties.Include(p => p.Location).Include(p => p.Photos).Include(p => p.Amenities).FirstOrDefaultAsync(p => p.Id == id);
            if (property == null) return null;
            
            return _mapper.Map<PropertyResponseDto>(property);
        }

        public async Task<PropertyResponseDto?> UpdatePropertyAsync(int id, UpdatePropertyRequestDto dto, string ownerId)
        {
            var property = await _dbContext.Properties.Include(p => p.Location).Include(p => p.Photos).Include(p => p.Amenities).FirstOrDefaultAsync(p => p.Id == id);
            if (property == null || property.OwnerId != ownerId) return null;

            property.Title = dto.Title ?? property.Title;
            property.Description = dto.Description ?? property.Description;
            property.PricePerNight = dto.PricePerNight ?? property.PricePerNight;
            property.MaxGuests = dto.MaxGuests ?? property.MaxGuests;
            property.Bedrooms = dto.Bedrooms ?? property.Bedrooms;
            property.Bathrooms = dto.Bathrooms ?? property.Bathrooms;
            property.IsAvailable = dto.IsAvailable ?? property.IsAvailable;
            property.Type = dto.Type ?? property.Type;
            property.LocationId = dto.LocationId ?? property.LocationId;

            await _dbContext.SaveChangesAsync();
            return _mapper.Map<PropertyResponseDto>(property);
        }

        public async Task<PropertyResponseDto?> AddLocationAsync(int propertyId, CreateLocationRequestDto dto, string ownerId)
        {
            var property = await _dbContext.Properties
                .Include(p => p.Location)
                .FirstOrDefaultAsync(p => p.Id == propertyId);

            if (property == null || property.OwnerId != ownerId)
                return null;

            if (property.Location == null)
            {
                property.Location = new Location
                {
                    Country = dto.Country,
                    City = dto.City,
                    Street = dto.Street,
                    HouseNumber = dto.HouseNumber,
                    ApartmentNumber = dto.ApartmentNumber,
                    PostalCode = dto.PostalCode,
                    Latitude = dto.Latitude,
                    Longitude = dto.Longitude
                };
            }
            else
            {
                property.Location.Country = dto.Country;
                property.Location.City = dto.City;
                property.Location.Street = dto.Street;
                property.Location.HouseNumber = dto.HouseNumber;
                property.Location.ApartmentNumber = dto.ApartmentNumber;
                property.Location.PostalCode = dto.PostalCode;
                property.Location.Latitude = dto.Latitude;
                property.Location.Longitude = dto.Longitude;
            }
            property.IsPublished = true; 
            await _dbContext.SaveChangesAsync();
            return _mapper.Map<PropertyResponseDto>(property);
        }
    }
}