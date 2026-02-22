namespace Roamly.Identity.Api.Options
{
    public class RedisSettings
    {
        public const string Section = "Redis";
        public string Host { get; init; } = "localhost";
        public int Port { get; init; } = 6379;
        public string ConnectionString => $"{Host}:{Port}";
    }
}