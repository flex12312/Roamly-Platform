using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Roamly.Identity.Api.Constants;
using Roamly.Identity.Api.DTOs.Requests;
using Roamly.Identity.Api.DTOs.Responses;
using Roamly.Identity.Api.Interfaces;
using Roamly.Identity.Api.Models;

namespace Roamly.Identity.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly IMapper _mapper;
        public AuthService(UserManager<ApplicationUser> userManager, IJwtTokenGenerator jwtTokenGenerator
            , IMapper mapper)
        {
            _jwtTokenGenerator = jwtTokenGenerator;
            _userManager = userManager;
            _mapper = mapper;
        }

        public async Task<string> LoginAsync(LoginRequestDto login)
        {
            var user = await _userManager.FindByEmailAsync(login.Email);
            if (user != null && await _userManager.CheckPasswordAsync(user, login.Password))
            {
                var token = await _jwtTokenGenerator.GenerateToken(user);
                return token;
            }
            return null;
        }


        public async Task<bool> RegisterAsync(RegisterRequestDto register)
        {
            var user = _mapper.Map<ApplicationUser>(register);

            var result = await _userManager.CreateAsync(user, register.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, UserRoles.Member.ToString());
                return true;
            }
            return false;
        }
    }
}