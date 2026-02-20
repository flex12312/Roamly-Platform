using Roamly.Identity.Api.DTOs.Requests;
using Roamly.Identity.Api.DTOs.Responses;

namespace Roamly.Identity.Api.Interfaces
{
    public interface IAuthService
    {
        Task<bool> RegisterAsync(RegisterRequestDto register);
        Task<AuthResponseDto> LoginAsync(LoginRequestDto login);
    }
}