using Roamly.Housing.Api.DTOs.Requests;
using Roamly.Housing.Api.DTOs.Responses;

namespace Roamly.Housing.Api.Interfaces
{
    public interface IPropertyService
    {
        Task<PropertyResponseDto?> CreatePropertyAsync(CreatePropertyRequestDto dto, string ownerId);
        Task<PropertyResponseDto?> GetPropertyByIdAsync(int id);
        Task<IEnumerable<PropertyResponseDto>> GetAllPropertiesAsync();
        Task<PropertyResponseDto?> UpdatePropertyAsync(int id, UpdatePropertyRequestDto dto, string ownerId);
        Task<bool> DeletePropertyAsync(int id, string ownerId);
        Task<PropertyResponseDto?> AddLocationAsync(int propertyId, CreateLocationRequestDto dto, string ownerId);
    }
}