using Roamly.Housing.Api.Constants;

namespace Roamly.Search.Api.DTOs.Requests
{
    public class SearchPropertiesRequestDto
    {
        public int? LocationId { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public PropertyType? PropertyType { get; set; }
        public string? SortBy { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}