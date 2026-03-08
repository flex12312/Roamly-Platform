namespace Roamly.Housing.Api.DTOs.Responses
{
    public class AmenityResponseDto
    {
        public required int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? Icon { get; set; }
    }
}