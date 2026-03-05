using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Roamly.Housing.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
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