namespace Roamly.Identity.Api.Models
{
    public class RefreshToken
    {
        public string UserId { get; set; }
        public string Token { get; set; }
        public DateTime ExpiresAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? RevokedAt { get; set; }
        public bool IsActive => RevokedAt == null && ExpiresAt > DateTime.UtcNow;
        public bool IsAbsolutelyExpired => CreatedAt.AddDays(7) <= DateTime.UtcNow;

    }
}