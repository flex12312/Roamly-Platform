using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Roamly.Identity.Api.Constants;
using Roamly.Identity.Api.DTOs.Requests;
using Roamly.Identity.Api.DTOs.Responses;
using Roamly.Identity.Api.Interfaces;
using Roamly.Identity.Api.Models;
using Roamly.Identity.Api.Options;

namespace Roamly.Identity.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly IRefreshTokenService _refreshTokenService;
        private readonly JwtSettings _jwtSettings;
       
        public AuthService(UserManager<ApplicationUser> userManager, IJwtTokenGenerator jwtTokenGenerator
            , IMapper mapper, IOptions<JwtSettings> options, IRefreshTokenService refreshTokenService)
        {
            _jwtTokenGenerator = jwtTokenGenerator;
            _userManager = userManager;
            _mapper = mapper;
            _jwtSettings = options.Value;
            _refreshTokenService = refreshTokenService;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto login)
        {
            var user = await _userManager.FindByEmailAsync(login.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, login.Password)) return null;
            
            var token = await _jwtTokenGenerator.GenerateToken(user);
            var refreshToken = _refreshTokenService.GenerateRefreshToken();
            var refreshTokenData = CreateRefreshToken(user.Id, refreshToken, DateTime.UtcNow);
            await _refreshTokenService.SaveRefreshTokenAsync(refreshTokenData);

            return new AuthResponseDto
            {
                Token = token,
                Email = user.Email ?? string.Empty,
                UserName = user.UserName ?? string.Empty,
                ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes),
                RefreshToken = refreshToken
            };
        }

        public async Task<AuthResponseDto?> RefreshAsync(string refreshToken)
        {
            var token = await _refreshTokenService.GetRefreshTokenAsync(refreshToken);
            if (token == null || !token.IsActive || token.IsAbsolutelyExpired)
            {
                await _refreshTokenService.RevokeRefreshTokenAsync(refreshToken);
                return null;
            }
            var user = await _userManager.FindByIdAsync(token.UserId);
            if (user == null)
            {
                await _refreshTokenService.RevokeRefreshTokenAsync(refreshToken);
                return null;
            }
            var newJwtToken = await _jwtTokenGenerator.GenerateToken(user);
            var newRefreshToken = _refreshTokenService.GenerateRefreshToken();

            var newRefreshTokenData = CreateRefreshToken(user.Id, newRefreshToken,token.CreatedAt);
            await _refreshTokenService.SaveRefreshTokenAsync(newRefreshTokenData);
            await _refreshTokenService.RevokeRefreshTokenAsync(refreshToken);

            return new AuthResponseDto
            {
                Token = newJwtToken,
                Email = user.Email ?? string.Empty,
                UserName = user.UserName ?? string.Empty,
                ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes),
                RefreshToken = newRefreshToken
            };
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
        private RefreshToken CreateRefreshToken(string userId, string token, DateTime createdAt)
        {
            return new RefreshToken
            {
                UserId = userId,
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddMinutes(30),
                CreatedAt = createdAt
            };
        }
    }
}