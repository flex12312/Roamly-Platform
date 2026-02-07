namespace Roamly.Identity.Api.DTOs.Requests
{
    public class LoginDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
