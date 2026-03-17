using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Roamly.Housing.Api.DTOs.Requests;
using Roamly.Housing.Api.DTOs.Responses;
using Roamly.Housing.Api.Interfaces;
using System.Security.Claims;

namespace Roamly.Housing.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HouseRulesController : ControllerBase
    {
        private readonly IHouseRulesService _houseRulesService;
        public HouseRulesController(IHouseRulesService houseRulesService)
        {
            _houseRulesService = houseRulesService;
        }

        [AllowAnonymous]
        [HttpGet("property/{propertyId}/houseRules")]
        public async Task<ActionResult<HouseRulesResponseDto>> GetHouseRules(int propertyId)
        {
            var res = await _houseRulesService.GetHouseRulesAsync(propertyId);
            if (res == null) return NotFound(new { message = "Объект не найден или нет прав"});

            return Ok(res);
        }

        [Authorize]
        [HttpPut("property/{propertyId}")]
        public async Task<IActionResult> UpdateHouseRules(int propertyId, [FromBody]AddHouseRulesRequestDto dto)
        {
            var ownerId = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var res = await _houseRulesService.UpdateHouseRulesAsync(propertyId, dto, ownerId);
            if(!res) return NotFound(new { message = "Объект не найден или нет прав" });

            return NoContent();
        }
    }
}