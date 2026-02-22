using Roamly.Identity.Api.Models;

namespace Roamly.Identity.Api.Interfaces
{
    public interface IRefreshTokenService
    {
        string GenerateRefreshToken();
        Task SaveRefreshTokenAsync(RefreshToken token);
        Task<RefreshToken?> GetRefreshTokenAsync(string token);
        Task RevokeRefreshTokenAsync(string token);
    }
}