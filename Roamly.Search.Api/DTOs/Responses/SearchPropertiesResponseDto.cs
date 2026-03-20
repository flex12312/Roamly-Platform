namespace Roamly.Search.Api.DTOs.Responses
{
    public class SearchPropertiesResponseDto
    {
        public List<PropertySearchResultDto> Properties { get; set; } = new List<PropertySearchResultDto>();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    } 
}