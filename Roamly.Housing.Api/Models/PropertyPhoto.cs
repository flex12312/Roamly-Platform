namespace Roamly.Housing.Api.Models
{
    public class PropertyPhoto
    {
        public int Id { get; set; }
        public required int PropertyId { get; set; }
        public required string ImageUrl { get; set; }
        public required bool IsMain { get; set; }
        public required int Order { get; set; }
        public string? ContentType { get; set; }

        public Property? Property { get; set; }
    }
}