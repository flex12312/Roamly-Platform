namespace Roamly.Booking.Api.Interfaces
{
    public interface IPropertyValidationService
    {
        Task<bool> ExistsAsync(int propertyId);
    }
}