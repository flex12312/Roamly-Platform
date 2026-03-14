using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata;
using Roamly.Housing.Api.DTOs.Responses;
using Roamly.Housing.Api.Interfaces;
using Roamly.Housing.Api.Services;
using System.Security.Claims;

namespace Roamly.Housing.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/Property/{propertyId}/photos")]
    public class PropertyPhotoController : ControllerBase
    {
        private readonly IPropertyPhotoService _propertyPhotoService;
        public PropertyPhotoController(IPropertyPhotoService propertyPhotoService)
        {
            _propertyPhotoService = propertyPhotoService;
        }

        [HttpDelete("{photoId}")]
        public async Task<IActionResult> DeletePropertyPhoto(int photoId)
        {
            var ownerId = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var success = await _propertyPhotoService.DeletePhotoAsync(photoId, ownerId);
            if (!success) return NotFound(new { message = "Объект не найден или нет прав" });

            return NoContent();
        }

        [HttpPut("{photoId}/primary")]
        public async Task<IActionResult> SetPrimaryPhoto(int photoId)
        {
            var ownerId = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var success = await _propertyPhotoService.SetPrimaryPhotoAsync(photoId, ownerId);
            if (!success) return NotFound(new { message = "Объект не найден или нет прав" });

            return Ok(new { message = "Главное фото установлено" });
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PropertyPhotoResponseDto>>> GetPhotos(int propertyId)
        {
            var photos = await _propertyPhotoService.GetPhotosAsync(propertyId);
            return Ok(photos);
        }

        [HttpPost]
        public async Task<ActionResult<PropertyPhotoResponseDto?>> UploadPhoto(int propertyId, IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest(new { message = "Файл не выбран" });

            var types = new[] { "image/jpeg", "image/png", "image/webp" };
            if (!types.Contains(file.ContentType)) return BadRequest(new { message = "Только JPG, PNG, WebP" });

            var ownerId = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var res = await _propertyPhotoService.UploadPhotoAsync(propertyId, file, ownerId);
            if (res == null) return NotFound(new { message = "Объект не найден или нет прав" });

            return CreatedAtAction(nameof(GetPhotos), new { propertyId }, res);
        }
    }
}