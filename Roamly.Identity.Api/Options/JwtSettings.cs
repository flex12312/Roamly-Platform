namespace Roamly.Identity.Api.Options
{
    public class JwtSettings
    {
        public const string Section = "JwtSettings";
        public string SecretKey { get; init; } = string.Empty;
        public string Issuer { get; init; } = string.Empty;
        public string Audience { get; init; } = string.Empty;
        public int ExpiryMinutes { get; init; } = 30;
    }
}