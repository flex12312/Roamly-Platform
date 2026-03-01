namespace Roamly.Housing.Api.Models
{
    public class Location
    {
        public required int Id { get; set; }
        public required string Country {  get; set; }
        public required string City { get; set; }
        public required string Street { get; set; }
        public required string HouseNumber { get; set; }
        public string? ApartmentNumber { get; set; }
        public string? PostalCode { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }



        public ICollection<Property> Properties { get; set; } = new List<Property>();
    }
}
