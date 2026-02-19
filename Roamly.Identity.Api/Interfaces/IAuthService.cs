using Roamly.Identity.Api.DTOs.Requests;

namespace Roamly.Identity.Api.Interfaces
{
    public interface IAuthService
    {
        Task<bool> RegisterAsync(RegisterRequestDto register);
        Task<string> LoginAsync(LoginRequestDto login);
    }
}