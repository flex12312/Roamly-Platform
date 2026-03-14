using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Roamly.Housing.Api.DTOs.Responses;
using Roamly.Housing.Api.Interfaces;
using System.Security.Claims;

namespace Roamly.Housing.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AmenitiesController : ControllerBase
    {
        private readonly IAmenityService _amenityService;
        public AmenitiesController(IAmenityService amenityService)
        {
            _amenityService = amenityService;
        }

        [Authorize]
        [HttpPost("property/{propertyId}")]
        public async Task<IActionResult> AddAmenities(int propertyId, [FromBody] int[] amenityIds)
        {
            var ownerId = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var res = await _amenityService.AddAmenitiesAsync(propertyId, amenityIds, ownerId);
            if(!res) return NotFound(new { message = "Объект не найден или нет прав" });

            return NoContent();
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<AmenityResponseDto>>> GetAllAmenities()
        {
            var amenities = await _amenityService.GetAllAmenitiesAsync();
            return Ok(amenities);
        }

        [AllowAnonymous]
        [HttpGet("property/{propertyId}/amenities")]
        public async Task<ActionResult<IEnumerable<AmenityResponseDto>>> GetPropertyAmenities(int propertyId)
        {
            var amenities = await _amenityService.GetPropertyAmenitiesAsync(propertyId);
            return Ok(amenities);
        }

        [Authorize]
        [HttpDelete("property/{propertyId}/{amenityId}")]
        public async Task<IActionResult> RemoveAmenity(int propertyId, int amenityId)
        {
            var ownerId = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var res = await _amenityService.RemoveAmenityAsync(propertyId, amenityId, ownerId);
            if (!res) return NotFound(new { message = "Объект не найден или нет прав" });

            return NoContent();
        }
    }
}