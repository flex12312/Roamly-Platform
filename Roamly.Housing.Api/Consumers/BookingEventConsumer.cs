using Confluent.Kafka;
using System.Text.Json;
using Roamly.Housing.Api.Data;

namespace Roamly.Housing.Api.Consumers
{
    public class BookingEventConsumer : BackgroundService
    {
        private readonly ILogger<BookingEventConsumer> _logger;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IConfiguration _configuration;
        private readonly string _bootstrapServers;
        private readonly string _topicName = "booking-events";
        public BookingEventConsumer(ILogger<BookingEventConsumer> logger, IServiceScopeFactory scopeFactory, IConfiguration configuration)
        {
            _logger = logger;
            _scopeFactory = scopeFactory;
            _configuration = configuration;
            _bootstrapServers = _configuration["Kafka:BootstrapServers"] ?? "kafka:9092";
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await Task.Yield();
            _logger.LogInformation("Consumer starting. Kafka: {Servers}", _bootstrapServers);

            var config = new ConsumerConfig()
            {
                BootstrapServers = _bootstrapServers,
                GroupId = "housing-service",
                AutoOffsetReset = AutoOffsetReset.Earliest,
                AllowAutoCreateTopics = true
            };

            using var consumer = new ConsumerBuilder<Ignore, string>(config).Build();
            consumer.Subscribe(_topicName);

            _logger.LogInformation("Subscribe to topic:{Topic}", _topicName);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var consumeResult = consumer.Consume(TimeSpan.FromSeconds(1));
                    if (consumeResult == null)
                    {
                        continue;
                    }

                    var message = consumeResult.Message.Value;
                    _logger.LogInformation("Message received: {Message}", message);

                    await ProcessEventAsync(message);
                }
                catch (ConsumeException ex)
                {
                    _logger.LogWarning(ex, "Kafka consume error. Retrying...");
                    await Task.Delay(TimeSpan.FromSeconds(2), stoppingToken);
                }
                catch (KafkaException ex)
                {
                    _logger.LogWarning(ex, "Kafka transport error. Retrying...");
                    await Task.Delay(TimeSpan.FromSeconds(2), stoppingToken);
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    break;
                }
            }
            consumer.Close();
            _logger.LogInformation("Consumer stopped");
        }

        private async Task ProcessEventAsync(string message)
        {
            try
            {
                using var jsonDoc = JsonDocument.Parse(message);
                var root = jsonDoc.RootElement;


                var eventTypeProp = root.EnumerateObject().FirstOrDefault(p => p.Name.Equals("EventType", StringComparison.OrdinalIgnoreCase));

                if (eventTypeProp.Name is null || eventTypeProp.Value.ValueKind != JsonValueKind.String)
                {
                    _logger.LogWarning("Missing or invalid 'EventType' in message: {Message}", message);
                    return;
                }
                var eventType = eventTypeProp.Value.GetString()!;

                _logger.LogInformation("Processing event: {EventType}", eventType);

                using var scope = _scopeFactory.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<HousingDbContext>();

                switch (eventType)
                {
                    case "CreateBooking": await HandleCreateBookingAsync(root, context); break;
                    case "CancelBooking": await HandleCancelBookingAsync(root, context); break;
                    case "CompleteBooking": await HandleCompleteBookingAsync(root, context); break;
                    default: _logger.LogWarning("Unknown event type ignored: {EventType}", eventType); break;
                }
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Invalid JSON format in Kafka message");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing event");
            }
        }

        private async Task HandleCompleteBookingAsync(JsonElement root, HousingDbContext context)
        {
            if (!TryGetPropertyId(root, out var propertyId))
            {
                _logger.LogWarning("PropertyId not found in CompleteBooking event");
                return;
            }

            var property = await context.Properties.FindAsync(propertyId);
            if (property != null)
            {
                property.IsAvailable = true;
                await context.SaveChangesAsync();
                _logger.LogInformation("Property {PropertyId} marked as available", propertyId);
            }
            else
            {
                _logger.LogWarning("Property {PropertyId} not found", propertyId);
            }
        }

        private async Task HandleCancelBookingAsync(JsonElement root, HousingDbContext context)
        {
            if (!TryGetPropertyId(root, out var propertyId))
            {
                _logger.LogWarning("PropertyId not found in CancelBooking event");
                return;
            }
            var property = await context.Properties.FindAsync(propertyId);

            if (property != null)
            {
                property.IsAvailable = true;
                await context.SaveChangesAsync();
                _logger.LogInformation("Property {PropertyId} marked as available", propertyId);
            }
            else
            {
                _logger.LogWarning("Property {PropertyId} not found", propertyId);
            }
        }

        private async Task HandleCreateBookingAsync(JsonElement root, HousingDbContext context)
        {
            if (!TryGetPropertyId(root, out var propertyId))
            {
                _logger.LogWarning("PropertyId not found in CreateBooking event");
                return;
            }

            var property = await context.Properties.FindAsync(propertyId);

            if (property != null)
            {
                property.IsAvailable = false;
                await context.SaveChangesAsync();
                _logger.LogInformation("Property {PropertyId} marked as unavailable", propertyId);
            }
            else
            {
                _logger.LogWarning("Property {PropertyId} not found", propertyId);
            }
        }
        private bool TryGetPropertyId(JsonElement root, out int propertyId)
        {
            propertyId = 0;

            if (root.TryGetProperty("propertyId", out var p1)) propertyId = p1.GetInt32();
            else if (root.TryGetProperty("PropertyId", out var p2)) propertyId = p2.GetInt32();
            else return false;

            return true;
        }
    }
}