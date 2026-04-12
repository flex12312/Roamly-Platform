using Confluent.Kafka;
using Microsoft.Extensions.Logging;
using Roamly.Booking.Api.Interfaces;
using Roamly.Shared.Events.Events;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace Roamly.Booking.Api.Services
{
    public class KafkaBookingEventPublisher : IKafkaBookingEventPublisher, IDisposable
    {
        private readonly ILogger<KafkaBookingEventPublisher> _logger;
        private readonly IProducer<Null, string> _producer;
        private bool _disposed = false;

        public KafkaBookingEventPublisher(IConfiguration configuration, ILogger<KafkaBookingEventPublisher> logger)
        {
            _logger = logger;
            var bootstrapServers = configuration["Kafka:BootstrapServers"] ?? "kafka:9092";
            var config = new ProducerConfig { BootstrapServers = bootstrapServers };
            _producer = new ProducerBuilder<Null, string>(config).Build();
        }

        public async Task PublishCancelBookingAsync(CancelBookingEvent @event)
        {
            var json = JsonSerializer.Serialize(@event);
            var message = new Message<Null, string> { Value = json };
            try
            {
                await _producer.ProduceAsync("booking-events", message);
                _logger.LogInformation("Event sent: {EventType}", @event.EventType);
            }
            catch (ProduceException<Null, string> ex)
            {
                _logger.LogError(ex, "Failed to send event");
            }
        }

        public async Task PublishCompleteBookingAsync(CompleteBookingEvent @event)
        {
            var json = JsonSerializer.Serialize(@event);
            var message = new Message<Null, string> { Value = json };
            try
            {
                await _producer.ProduceAsync("booking-events", message);
                _logger.LogInformation("Event sent: {EventType}", @event.EventType);
            }
            catch (ProduceException<Null, string> ex)
            {
                _logger.LogError(ex, "Failed to send event");
            }
        }

        public async Task PublishCreateBookingAsync(CreateBookingEvent @event)
        {
            var json = JsonSerializer.Serialize(@event);
            var message = new Message<Null, string> { Value = json };
            try
            {
                await _producer.ProduceAsync("booking-events", message);
                _logger.LogInformation("Event sent: {EventType}", @event.EventType);
            }
            catch (ProduceException<Null, string> ex)
            {
                _logger.LogError(ex, "Failed to send event");
            }
        }

        public void Dispose()
        {
            if (!_disposed)
            {
                _producer.Flush(TimeSpan.FromSeconds(5));
                _producer.Dispose();
                _disposed = true;
            }
        }
    }
}