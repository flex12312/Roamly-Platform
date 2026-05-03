using Roamly.Shared.Events.Events;

namespace Roamly.Booking.Api.Interfaces
{
    public interface IKafkaBookingEventPublisher
    {
        Task PublishCreateBookingAsync(CreateBookingEvent @event);
        Task PublishCancelBookingAsync(CancelBookingEvent @event);
        Task PublishCompleteBookingAsync(CompleteBookingEvent @event);
    }
}