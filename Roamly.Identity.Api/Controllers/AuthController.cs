using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Roamly.Identity.Api.Constants;
using Roamly.Identity.Api.DTOs.Requests;
using Roamly.Identity.Api.Models;

namespace Roamly.Identity.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController: ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        public AuthController(UserManager<ApplicationUser> userManager, IMapper mapper)
        {
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto registerDto)
        {
            var user = _mapper.Map<ApplicationUser>(registerDto);
           
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, UserRoles.Member.ToString());
                return Ok("Пользователь успешно зарегистрирован с ролью Member");
            }
            return BadRequest(result.Errors);
        }
    }
}