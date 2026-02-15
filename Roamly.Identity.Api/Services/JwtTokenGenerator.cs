using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Roamly.Identity.Api.Interfaces;
using Roamly.Identity.Api.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Roamly.Identity.Api.Services
{
    public class JwtTokenGenerator : IJwtTokenGenerator
    {
        private readonly IConfiguration _config;
        private readonly UserManager<ApplicationUser> _userManager;
        public JwtTokenGenerator(IConfiguration config, UserManager<ApplicationUser> userManager)
        {
            _config = config;
            _userManager = userManager;
        }
        public async Task<string> GenerateToken(ApplicationUser user)
        {
            var jwtSettings = _config.GetSection("JwtSettings");
            var key = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]);

            var claims = new List<Claim>
            {
               new Claim(JwtRegisteredClaimNames.Email, user.Email),
               new Claim(JwtRegisteredClaimNames.Sub, user.Id),
               new Claim(JwtRegisteredClaimNames.GivenName, user.FirstName),
               new Claim(JwtRegisteredClaimNames.FamilyName, user.LastName)
            };
            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"]
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}