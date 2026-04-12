using Roamly.Booking.Api.Interfaces;

namespace Roamly.Booking.Api.Services
{
    public class PropertyValidationService : IPropertyValidationService
    {
        private readonly HttpClient _http;
        private readonly ILogger<PropertyValidationService> _logger;

        public PropertyValidationService(HttpClient http, ILogger<PropertyValidationService> logger)
        {
            _http = http;
            _logger = logger;
        }

        public async Task<bool> ExistsAsync(int propertyId)
        {
            try
            {
                var response = await _http.GetAsync($"/api/Property/{propertyId}/exists");
                response.EnsureSuccessStatusCode();
                var exists = await response.Content.ReadFromJsonAsync<bool>();
                return exists;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to validate property {PropertyId}", propertyId);
                return false;
            }
        }
    }
}