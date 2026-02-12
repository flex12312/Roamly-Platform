using AutoMapper;
using Roamly.Identity.Api.DTOs.Requests;
using Roamly.Identity.Api.Models;
using Roamly.Identity.Api.Validators;

namespace Roamly.Identity.Api.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<RegisterRequestDto,ApplicationUser>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email));
        }
    }
}