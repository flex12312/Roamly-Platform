using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Roamly.Housing.Api.Data;
using Roamly.Housing.Api.DTOs.Requests;
using Roamly.Housing.Api.DTOs.Responses;
using Roamly.Housing.Api.Interfaces;
using Roamly.Housing.Api.Models;

namespace Roamly.Housing.Api.Services
{
    public class HouseRulesService : IHouseRulesService
    {
        private readonly HousingDbContext _dbContext;
        private readonly IMapper _mapper;
        public HouseRulesService(HousingDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }
        public async Task<HouseRulesResponseDto?> GetHouseRulesAsync(int propertyId)
        {
            var property = await _dbContext.Properties.Include(p => p.HouseRules).FirstOrDefaultAsync(p => p.Id == propertyId);
            if (property == null || property.HouseRules == null) return null;

            return _mapper.Map<HouseRulesResponseDto>(property.HouseRules);
        }

        public async Task<bool> UpdateHouseRulesAsync(int propertyId, AddHouseRulesRequestDto dto, string ownerId)
        {
            var property = await _dbContext.Properties.Include(p => p.HouseRules).FirstOrDefaultAsync(p => p.Id == propertyId);
            if (property == null || property.OwnerId != ownerId) return false;

            if (property.HouseRules != null)
            {
                property.HouseRules.SmokingAllowed = dto.SmokingAllowed;
                property.HouseRules.ChildrenAllowed = dto.ChildrenAllowed;
                property.HouseRules.PetsAllowed = dto.PetsAllowed;
                property.HouseRules.CheckOutBefore = dto.CheckOutBefore;
                property.HouseRules.CheckInFrom = dto.CheckInFrom;
            }
            else
            {
                property.HouseRules = new HouseRules()
                {
                    PropertyId = propertyId,
                    SmokingAllowed = dto.SmokingAllowed,
                    ChildrenAllowed = dto.ChildrenAllowed,
                    PetsAllowed = dto.PetsAllowed,
                    CheckOutBefore = dto.CheckOutBefore,
                    CheckInFrom = dto.CheckInFrom
                };
            }

            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}