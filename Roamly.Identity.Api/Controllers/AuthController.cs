using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Roamly.Identity.Api.DTOs.Requests;
using Roamly.Identity.Api.Models;

namespace Roamly.Identity.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController: ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        public AuthController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto registerDto)
        {
            var user = new ApplicationUser { 
                UserName = registerDto.Email,
                FirstName = registerDto.FirstName, 
                LastName = registerDto.LastName ,
                Email = registerDto.Email ,
                BirthDate = registerDto.BirthDate 
            };
            var res = await _userManager.CreateAsync(user, registerDto.Password);

            if (!res.Succeeded)
            {
                return BadRequest(res.Errors);
            }
            return Ok(new { message = "User registered successfully" });
        }
    }
}
