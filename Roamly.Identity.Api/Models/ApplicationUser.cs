using Microsoft.AspNetCore.Identity;

namespace Roamly.Identity.Api.Models
{
    public class ApplicationUser : IdentityUser
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public DateOnly BirthDate { get; set; }
        public DateOnly RegistrationDate { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
    }
}