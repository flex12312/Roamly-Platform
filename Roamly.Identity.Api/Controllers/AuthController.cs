using Microsoft.AspNetCore.Mvc;
using Roamly.Identity.Api.DTOs.Requests;
using Roamly.Identity.Api.Interfaces;
using Roamly.Identity.Api.Models;

namespace Roamly.Identity.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController: ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto registerDto)
        {
            var result = await _authService.RegisterAsync(registerDto);
            return result == true ? Ok(new { message = "The user has been successfully registered" }) : BadRequest(new { message = "Registration failed" });
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto login)
        {
            var result = await _authService.LoginAsync(login);
            return result != null ? Ok(new { token = result, userName = login.Email }) : Unauthorized(new { message = "Invalid password or email" });
        }
    }
}