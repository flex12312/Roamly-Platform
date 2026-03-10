using Roamly.Housing.Api.Constants;

namespace Roamly.Housing.Api.DTOs.Requests
{
    public class CreatePropertyRequestDto
    {
        public int? LocationId { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required PropertyType Type { get; set; }
        public required int MaxGuests { get; set; }
        public required int Bedrooms { get; set; }
        public required int Bathrooms { get; set; }
        public required decimal PricePerNight { get; set; }
        public required bool IsAvailable { get; set; }
    }
}