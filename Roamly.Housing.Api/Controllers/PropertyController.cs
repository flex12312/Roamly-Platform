using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Roamly.Housing.Api.DTOs.Requests;
using Roamly.Housing.Api.DTOs.Responses;
using Roamly.Housing.Api.Interfaces;
using System.Security.Claims;

namespace Roamly.Housing.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PropertyController : ControllerBase
    {
        private readonly IPropertyService _propertyService;
        public PropertyController(IPropertyService propertyService)
        {
            _propertyService = propertyService;
        }

        [HttpPost]
        public async Task<ActionResult<PropertyResponseDto>> CreateProperty([FromBody] CreatePropertyRequestDto dto)
        {
            var ownerId = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var result = await _propertyService.CreatePropertyAsync(dto, ownerId);
            if (result == null) return NotFound(new { message = "Локация не найдена" });

            return CreatedAtAction(nameof(GetPropertyById), new { id = result.Id }, result);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PropertyResponseDto>>> GetAllProperties()
        {
            var properties = await _propertyService.GetAllPropertiesAsync();

            return Ok(properties);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PropertyResponseDto>> GetPropertyById(int id)
        {
            var property = await _propertyService.GetPropertyByIdAsync(id);
            if (property == null) return NotFound(new { message = "Объект не найден" });

            return Ok(property);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<PropertyResponseDto>> UpdateProperty(int id, [FromBody] UpdatePropertyRequestDto dto)
        {
            var ownerId = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var result = await _propertyService.UpdatePropertyAsync(id, dto, ownerId);
            if (result == null) return NotFound(new { message = "Объект не найден или нет прав" });

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProperty(int id)
        {
            var ownerId = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var success = await _propertyService.DeletePropertyAsync(id, ownerId);
            if (!success) return NotFound(new { message = "Объект не найден или нет прав" });

            return NoContent();
        }

        [HttpPut("{id}/location")]
        public async Task<ActionResult<PropertyResponseDto>> AddLocation(int id, [FromBody] CreateLocationRequestDto dto)
        {
            var ownerId = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var result = await _propertyService.AddLocationAsync(id, dto, ownerId);
            if (result == null) return NotFound(new { message = "Объект не найден или нет прав" });

            return Ok(result);
        }
    }
}