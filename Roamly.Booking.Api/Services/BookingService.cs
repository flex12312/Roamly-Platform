using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Roamly.Booking.Api.Constants;
using Roamly.Booking.Api.Data;
using Roamly.Booking.Api.DTOs.Requests;
using Roamly.Booking.Api.DTOs.Responses;
using Roamly.Booking.Api.Interfaces;
using Roamly.Booking.Api.Models;
using Roamly.Shared.Events.Events;
using BookingEntity = Roamly.Booking.Api.Models.Booking;


namespace Roamly.Booking.Api.Services
{
    public class BookingService : IBookingService
    {
        private readonly BookingDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IKafkaBookingEventPublisher _eventPublisher;
        private readonly IPropertyValidationService _propertyValidator;
        public BookingService(BookingDbContext dbContext, IMapper mapper, IKafkaBookingEventPublisher eventPublisher, IPropertyValidationService propertyValidator)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _eventPublisher = eventPublisher;
            _propertyValidator = propertyValidator;
        }
        public async Task<bool> CancelBookingAsync(CancelBookingRequestDto dto, int bookingId)
        {
            var booking = await _dbContext.Bookings.FindAsync(bookingId);
            if (booking == null) return false;

            booking.Status = BookingStatus.Cancelled;
            booking.CancellationReason = dto.Reason;
            booking.UpdatedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();

            await _eventPublisher.PublishCancelBookingAsync(new CancelBookingEvent()
            {
                BookingId = bookingId,
                PropertyId = booking.PropertyId,
                GuestId = booking.GuestId,
            });
            return true;
        }

        public async Task<BookingResponseDto> CreateBookingAsync(CreateBookingRequestDto dto, string guestId)
        {
            // 1. Валидация существования жилья
            if (!await _propertyValidator.ExistsAsync(dto.PropertyId))
                throw new InvalidOperationException($"Property {dto.PropertyId} not found");

            var hasConflict = await _dbContext.Bookings.AnyAsync(b => b.PropertyId == dto.PropertyId && b.Status != BookingStatus.Cancelled && dto.CheckIn < b.CheckOut && dto.CheckOut > b.CheckIn);

            if (hasConflict)
                throw new InvalidOperationException("Property is already booked for selected dates");

            var booking = _mapper.Map<BookingEntity>(dto);
            booking.GuestId = guestId;
            booking.Status = BookingStatus.Pending;
            booking.CreatedAt = DateTime.UtcNow;
            booking.CheckIn = dto.CheckIn.ToUniversalTime();
            booking.CheckOut = dto.CheckOut.ToUniversalTime();

            await _dbContext.Bookings.AddAsync(booking);
            await _dbContext.SaveChangesAsync();

            await _eventPublisher.PublishCreateBookingAsync(new CreateBookingEvent()
            {
                BookingId = booking.Id,
                PropertyId = dto.PropertyId,
                GuestId = guestId,
                CheckIn = dto.CheckIn.ToUniversalTime(),
                CheckOut = dto.CheckOut.ToUniversalTime()
            });

            return _mapper.Map<BookingResponseDto>(booking);
        }

        public async Task<BookingResponseDto?> GetBookingByIdAsync(int bookingId)
        {
            var booking = await _dbContext.Bookings.FindAsync(bookingId);
            if (booking == null) return null;

            return _mapper.Map<BookingResponseDto>(booking);
        }

        public async Task<IEnumerable<BookingResponseDto>> GetUserBookingsAsync(string guestId)
        {
            var bookings = await _dbContext.Bookings.Where(b => b.GuestId == guestId).OrderByDescending(b => b.CreatedAt).ToListAsync(); 

            return _mapper.Map<IEnumerable<BookingResponseDto>>(bookings);
        }
    }
}