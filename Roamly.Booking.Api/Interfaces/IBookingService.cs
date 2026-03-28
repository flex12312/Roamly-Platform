using Roamly.Booking.Api.DTOs.Requests;
using Roamly.Booking.Api.DTOs.Responses;

namespace Roamly.Booking.Api.Interfaces
{
    public interface IBookingService
    {
        Task<BookingResponseDto> CreateBookingAsync(CreateBookingRequestDto dto, string guestId);
        Task<BookingResponseDto?> GetBookingByIdAsync(int bookingId);
        Task<IEnumerable<BookingResponseDto>> GetUserBookingsAsync(string guestId);
        Task<bool> CancelBookingAsync(CancelBookingRequestDto dto, int bookingId);
    }
}