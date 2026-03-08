using Roamly.Housing.Api.Constants;

namespace Roamly.Housing.Api.DTOs.Responses
{
    public class PropertyResponseDto
    {
        public required int Id { get; set; }
        public required string OwnerId { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required PropertyType Type { get; set; }
        public required int MaxGuests { get; set; }
        public required int Bedrooms { get; set; }
        public required int Bathrooms { get; set; }
        public required decimal PricePerNight { get; set; }
        public required bool IsAvailable { get; set; }
        public required LocationResponseDto Location { get; set; } 
        public required List<PropertyPhotoResponseDto> Photos { get; set; }  
        public required List<AmenityResponseDto> Amenities { get; set; } 
        public DateTime CreatedAt { get; set; } 
        public DateTime? LastUpdatedAt { get; set; }
    }
}