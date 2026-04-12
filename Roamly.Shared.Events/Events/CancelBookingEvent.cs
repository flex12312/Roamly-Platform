using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Roamly.Shared.Events.Events
{
    public class CancelBookingEvent
    {
        public string EventId { get; set; } = Guid.NewGuid().ToString();
        public int BookingId { get; set; }
        public int PropertyId { get; set; }
        public string GuestId { get; set; }
        public string EventType { get; set; } = "CancelBooking";
    }
}