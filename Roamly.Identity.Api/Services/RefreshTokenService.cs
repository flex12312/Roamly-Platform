using Roamly.Identity.Api.Interfaces;
using Roamly.Identity.Api.Models;
using StackExchange.Redis;
using System.Text.Json;

namespace Roamly.Identity.Api.Services
{
    public class RefreshTokenService : IRefreshTokenService
    {
        private readonly IDatabase _database;
        public RefreshTokenService(IConnectionMultiplexer connection)
        {
            _database = connection.GetDatabase();
        }

        public string GenerateRefreshToken()
        {
            return Guid.NewGuid().ToString() + "-" + Guid.NewGuid().ToString();
        }

        public async Task<RefreshToken?> GetRefreshTokenAsync(string token)
        {
            var key = $"refresh_token:{token}";
            var value = await _database.StringGetAsync(key);
            if (value.IsNullOrEmpty) return null;
            return JsonSerializer.Deserialize<RefreshToken>(value!);
        }

        public async Task RevokeRefreshTokenAsync(string token)
        {
            var key = $"refresh_token:{token}";
            await _database.KeyDeleteAsync(key);
        }

        public async Task SaveRefreshTokenAsync(RefreshToken token)
        {
            var key = $"refresh_token:{token.Token}";
            var value = JsonSerializer.Serialize(token);
            var expiry = token.ExpiresAt - DateTime.UtcNow;
            await _database.StringSetAsync(key,value,expiry);
        }
    }
}