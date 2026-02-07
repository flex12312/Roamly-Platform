using Roamly.Identity.Api.Models;

namespace Roamly.Identity.Api.Interfaces
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(ApplicationUser user);
    }
}