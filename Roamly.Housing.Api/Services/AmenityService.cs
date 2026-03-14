using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Roamly.Housing.Api.Data;
using Roamly.Housing.Api.DTOs.Responses;
using Roamly.Housing.Api.Interfaces;

namespace Roamly.Housing.Api.Services
{
    public class AmenityService : IAmenityService
    {
        private readonly HousingDbContext _dbContext;
        private readonly IMapper _mapper;
        public AmenityService(HousingDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }
        public async Task<bool> AddAmenitiesAsync(int propertyId, int[] amenityIds, string ownerId)
        {
            var property = await _dbContext.Properties.Include(p => p.Amenities).FirstOrDefaultAsync(p => p.Id == propertyId);
            if (property == null || property.OwnerId != ownerId) return false;

            var amenities = await _dbContext.Amenities.Where(a => amenityIds.Contains(a.Id)).ToListAsync();
            foreach (var amenity in amenities)
            {
                if (!property.Amenities.Any(a => a.Id == amenity.Id)) property.Amenities.Add(amenity);
            }
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<AmenityResponseDto>> GetAllAmenitiesAsync()
        {
            var amenities = await _dbContext.Amenities.ToListAsync();
            return _mapper.Map<IEnumerable<AmenityResponseDto>>(amenities);
        }

        public async Task<IEnumerable<AmenityResponseDto>> GetPropertyAmenitiesAsync(int propertyId)
        {
            var property = await _dbContext.Properties.Include(p => p.Amenities).FirstOrDefaultAsync(p => p.Id == propertyId);
            if(property == null) return Enumerable.Empty<AmenityResponseDto>();

            return _mapper.Map<IEnumerable<AmenityResponseDto>>(property.Amenities);
        }

        public async Task<bool> RemoveAmenityAsync(int propertyId, int amenityId, string ownerId)
        {
            var property = await _dbContext.Properties.Include(p => p.Amenities).FirstOrDefaultAsync(p => p.Id == propertyId);
            if (property == null || property.OwnerId != ownerId) return false;

            var amenity = property.Amenities.FirstOrDefault(a => a.Id == amenityId);
            if(amenity == null) return false;

            property.Amenities.Remove(amenity);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}