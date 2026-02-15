using Roamly.Identity.Api.Models;

namespace Roamly.Identity.Api.Interfaces
{
    public interface IJwtTokenGenerator
    {
        Task<string> GenerateToken(ApplicationUser user);
    }
}