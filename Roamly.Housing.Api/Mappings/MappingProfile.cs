using AutoMapper;
using Roamly.Housing.Api.DTOs.Requests;
using Roamly.Housing.Api.DTOs.Responses;
using Roamly.Housing.Api.Models;

namespace Roamly.Housing.Api.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<CreatePropertyRequestDto, Property>();
            CreateMap<Property, PropertyResponseDto>();
            CreateMap<Location, LocationResponseDto>();
            CreateMap<PropertyPhoto, PropertyPhotoResponseDto>();
            CreateMap<Amenity, AmenityResponseDto>();
        }
    }
}