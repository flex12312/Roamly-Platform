using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Roamly.Housing.Api.Data;
using Roamly.Search.Api.DTOs.Requests;
using Roamly.Search.Api.DTOs.Responses;
using Roamly.Search.Api.Interfaces;

namespace Roamly.Search.Api.Services
{
    public class SearchService : ISearchService
    {
        private readonly HousingDbContext _dbContext;
        private readonly IMapper _mapper;
        public SearchService(HousingDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }
        public async Task<SearchPropertiesResponseDto> SearchAsync(SearchPropertiesRequestDto dto)
        {
            var query = _dbContext.Properties.Include(p => p.Location).Include(p => p.Photos).Where(p => p.IsPublished && p.IsAvailable).AsQueryable();

            if (dto.PropertyType.HasValue) query = query.Where(q => q.Type == dto.PropertyType.Value);
            if (dto.LocationId.HasValue) query = query.Where(q => q.LocationId == dto.LocationId.Value);
            if (dto.MaxPrice.HasValue) query = query.Where(q => q.PricePerNight <= dto.MaxPrice.Value);
            if (dto.MinPrice.HasValue) query = query.Where(q => q.PricePerNight >= dto.MinPrice.Value);

            query = dto.SortBy switch
            {
                "PriceAsc" => query.OrderBy(p => p.PricePerNight),
                "PriceDesc" => query.OrderByDescending(p => p.PricePerNight),
                "Newest" => query.OrderByDescending(p => p.CreatedAt),
                _ => query.OrderByDescending(p => p.CreatedAt)
            };

            var totalCount = await query.CountAsync();

            var items = await query.Skip((dto.PageNumber - 1) * dto.PageSize).Take(dto.PageSize).ToListAsync();

            return new SearchPropertiesResponseDto()
            {
                Properties = _mapper.Map<List<PropertySearchResultDto>>(items),
                TotalCount = totalCount,
                PageNumber = dto.PageNumber,
                PageSize = dto.PageSize,
                TotalPages = (int)Math.Ceiling((double)totalCount / dto.PageSize)
            };
        }
    }
}