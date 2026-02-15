using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Roamly.Identity.Api.DTOs.Requests;
using Roamly.Identity.Api.Interfaces;
using Roamly.Identity.Api.Models;

namespace Roamly.Identity.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly UserManager<ApplicationUser> _userManager;
        public LoginController(IJwtTokenGenerator jwtTokenGenerator, UserManager<ApplicationUser> userManager)
        {
            _jwtTokenGenerator = jwtTokenGenerator;
            _userManager = userManager;
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody]LoginRequestDto login)
        {
            var user = await _userManager.FindByEmailAsync(login.Email);
            if (user != null && await _userManager.CheckPasswordAsync(user, login.Password))
            {
                var token = await _jwtTokenGenerator.GenerateToken(user);
                return Ok(new
                {
                    Token = token,
                    UserName = user.UserName
                });
            }
            return Unauthorized("Invalid password or email");
        }
    }
}