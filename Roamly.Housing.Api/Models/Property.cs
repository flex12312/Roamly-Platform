using Roamly.Housing.Api.Constants;

namespace Roamly.Housing.Api.Models
{
    public class Property
    {
        public required int Id { get; set; }
        public required string OwnerId { get; set; }
        public int? LocationId { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required PropertyType Type { get; set; }
        public required int MaxGuests { get; set; }
        public required int Bedrooms { get; set; }
        public required int Bathrooms { get; set; }
        public required decimal PricePerNight { get; set; }
        public required bool IsAvailable { get; set; }
        public required bool IsPublished { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastUpdatedAt { get; set; }
        


        public Location? Location { get; set; }
        public HouseRules? HouseRules { get; set; }
        public ICollection<PropertyPhoto> Photos { get; set; } = new List<PropertyPhoto>();
        public ICollection<Amenity> Amenities { get; set; } = new List<Amenity>();
    }
}