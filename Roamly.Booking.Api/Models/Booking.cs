using Roamly.Booking.Api.Constants;

namespace Roamly.Booking.Api.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public int PropertyId { get; set; }
        public string GuestId { get; set; } = string.Empty;
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public int Guests { get; set; }
        public decimal TotalPrice { get; set; }
        public BookingStatus Status { get; set; }
        public string? CancellationReason { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}