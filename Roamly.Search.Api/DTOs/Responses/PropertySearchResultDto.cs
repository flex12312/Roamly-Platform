namespace Roamly.Search.Api.DTOs.Responses
{
    public class PropertySearchResultDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal PricePerNight { get; set; }
        public string LocationName { get; set; } = string.Empty;
        public string PropertyType { get; set; } = string.Empty;
        public int MaxGuests { get; set; }
        public int Bedrooms { get; set; }
        public int Bathrooms { get; set; }
        public string? MainPhotoUrl { get; set; }
        public bool IsAvailable { get; set; }
        public bool IsPublished { get; set; }
    }
}