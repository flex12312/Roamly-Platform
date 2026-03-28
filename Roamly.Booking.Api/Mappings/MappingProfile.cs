using AutoMapper;
using Roamly.Booking.Api.DTOs.Requests;
using Roamly.Booking.Api.DTOs.Responses;
using BookingEntity = Roamly.Booking.Api.Models.Booking;

namespace Roamly.Booking.Api.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<CreateBookingRequestDto, BookingEntity>();
            CreateMap<BookingEntity, BookingResponseDto>();
        }
    }
}
