namespace Roamly.Shared.Events.Events
{
    public class CreateBookingEvent
    {
        public string EventId { get; set; } = Guid.NewGuid().ToString();
        public int BookingId { get; set; }
        public int PropertyId { get; set; }
        public string GuestId { get; set; }
        public string EventType { get; set; } = "CreateBooking";
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
    }
}