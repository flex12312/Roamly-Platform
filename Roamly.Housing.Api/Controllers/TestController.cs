using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Roamly.Housing.Api.DTOs.Requests;
using Roamly.Housing.Api.Validators;
using System.Security.Claims;
using FluentValidation;

namespace Roamly.Housing.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpPost("property")]
        public async Task<IActionResult> CreateProperty([FromBody] CreatePropertyRequestDto dto)
        {
            return Ok(new { message = "Валидация прошла успешно!", data = dto });
        }

        [AllowAnonymous]
        [HttpGet("public")]
        public IActionResult Test1()
        {
            return Ok(new { message = "Это публичный endpoint", timestamp = DateTime.UtcNow });
        }

        [HttpGet("protected")]
        public IActionResult Test2()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value ?? User.FindFirst("email")?.Value;  
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(email))
            {
                return Ok(new { message = "Токен валиден, но Email не найден в Claims", userId = userId });
            }
            return Ok(new { message = "Это защищённый endpoint!", email = email, userId = userId, timestamp = DateTime.UtcNow });
        }
    }
}