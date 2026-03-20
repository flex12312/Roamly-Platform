using AutoMapper;
using Roamly.Housing.Api.Models;
using Roamly.Search.Api.DTOs.Responses;

namespace Roamly.Search.Api.Mappings
{
    public class SearchMappingProfile :Profile
    {
        public SearchMappingProfile()
        {
            CreateMap<Property, PropertySearchResultDto>()
                .ForMember(dest => dest.LocationName, opt => opt.MapFrom(src => src.Location != null ? src.Location.City : "Unknown"))
                .ForMember(dest => dest.PropertyType, opt => opt.MapFrom(src => src.Type.ToString()))
                .ForMember(dest => dest.MainPhotoUrl, opt => opt.MapFrom(src => src.Photos.FirstOrDefault() != null ? src.Photos.FirstOrDefault().ImageUrl : null));
        }
    }
}