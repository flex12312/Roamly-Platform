using Roamly.Booking.Api.Constants;

namespace Roamly.Booking.Api.DTOs.Requests
{
    public class CreateBookingRequestDto
    {
        public int PropertyId { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public int Guests { get; set; }
    }
}
