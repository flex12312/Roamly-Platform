using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Roamly.Search.Api.DTOs.Requests;
using Roamly.Search.Api.DTOs.Responses;
using Roamly.Search.Api.Interfaces;

namespace Roamly.Search.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly ISearchService _searchService;
        public SearchController(ISearchService searchService)
        {
            _searchService = searchService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<SearchPropertiesResponseDto>> Search([FromQuery] SearchPropertiesRequestDto dto)
        {
            var results = await _searchService.SearchAsync(dto);
            return Ok(results);
        }
    }
}