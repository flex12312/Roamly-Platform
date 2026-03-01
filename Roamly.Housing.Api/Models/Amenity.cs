namespace Roamly.Housing.Api.Models
{
    public class Amenity
    {
        public required int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? Icon { get; set; }


        public ICollection<Property> Properties { get; set; } = new List<Property>();
    }
}