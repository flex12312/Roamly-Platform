namespace Roamly.Identity.Api.DTOs.Responses
{
    public class AuthResponseDto
    {
        public required string Token { get; set; }
        public required string Email { get; set; }
        public required string UserName { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
