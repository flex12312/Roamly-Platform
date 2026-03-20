using Roamly.Search.Api.DTOs.Requests;
using Roamly.Search.Api.DTOs.Responses;

namespace Roamly.Search.Api.Interfaces
{
    public interface ISearchService
    {
        Task<SearchPropertiesResponseDto> SearchAsync(SearchPropertiesRequestDto dto);
    }
}