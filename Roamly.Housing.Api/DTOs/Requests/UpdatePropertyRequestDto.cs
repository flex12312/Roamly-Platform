using Roamly.Housing.Api.Constants;

namespace Roamly.Housing.Api.DTOs.Requests
{
    public class UpdatePropertyRequestDto
    {
        public int? LocationId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public PropertyType? Type { get; set; }
        public int? MaxGuests { get; set; }
        public int? Bedrooms { get; set; }
        public int? Bathrooms { get; set; }
        public decimal? PricePerNight { get; set; }
        public bool? IsAvailable { get; set; }
    }
}