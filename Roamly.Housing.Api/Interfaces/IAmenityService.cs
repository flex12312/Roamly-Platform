using Roamly.Housing.Api.DTOs.Responses;

namespace Roamly.Housing.Api.Interfaces
{
    public interface IAmenityService
    {
        Task<IEnumerable<AmenityResponseDto>> GetAllAmenitiesAsync();
        Task<IEnumerable<AmenityResponseDto>> GetPropertyAmenitiesAsync(int propertyId);
        Task<bool> AddAmenitiesAsync(int propertyId, int[] amenityIds, string ownerId);
        Task<bool> RemoveAmenityAsync(int propertyId, int amenityId, string ownerId);
    }
}