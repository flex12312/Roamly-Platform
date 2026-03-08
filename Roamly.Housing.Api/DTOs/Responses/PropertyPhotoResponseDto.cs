namespace Roamly.Housing.Api.DTOs.Responses
{
    public class PropertyPhotoResponseDto
    {
        public required int Id { get; set; }
        public required string ImageUrl { get; set; }
        public required bool IsMain { get; set; }
        public required int Order { get; set; }
    }
}