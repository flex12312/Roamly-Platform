using Roamly.Housing.Api.DTOs.Requests;
using Roamly.Housing.Api.DTOs.Responses;

namespace Roamly.Housing.Api.Interfaces
{
    public interface IHouseRulesService
    {
        Task<HouseRulesResponseDto?> GetHouseRulesAsync(int propertyId);
        Task<bool> UpdateHouseRulesAsync(int propertyId, AddHouseRulesRequestDto dto, string ownerId);
    }
}