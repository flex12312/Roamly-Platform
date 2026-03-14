using Roamly.Housing.Api.DTOs.Responses;

namespace Roamly.Housing.Api.Interfaces
{
    public interface IPropertyPhotoService
    {
        Task<PropertyPhotoResponseDto?> UploadPhotoAsync(int propertyId, IFormFile file, string ownerId);
        Task<IEnumerable<PropertyPhotoResponseDto>> GetPhotosAsync(int propertyId);
        Task<bool> DeletePhotoAsync(int photoId, string ownerId);
        Task<bool> SetPrimaryPhotoAsync(int photoId, string ownerId);
    }
}