using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Roamly.Booking.Api.Constants;
using Roamly.Booking.Api.Data;
using Roamly.Booking.Api.DTOs.Requests;
using Roamly.Booking.Api.DTOs.Responses;
using Roamly.Booking.Api.Interfaces;
using Roamly.Booking.Api.Models;
using BookingEntity = Roamly.Booking.Api.Models.Booking;


namespace Roamly.Booking.Api.Services
{
    public class BookingService : IBookingService
    {
        private readonly BookingDbContext _dbContext;
        private readonly IMapper _mapper;
        public BookingService(BookingDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }
        public async Task<bool> CancelBookingAsync(CancelBookingRequestDto dto, int bookingId)
        {
            var booking = await _dbContext.Bookings.FindAsync(bookingId);
            if (booking == null) return false;

            booking.Status = BookingStatus.Cancelled;
            booking.CancellationReason = dto.Reason;
            booking.UpdatedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<BookingResponseDto> CreateBookingAsync(CreateBookingRequestDto dto, string guestId)
        {

            var booking = _mapper.Map<BookingEntity>(dto);
            booking.GuestId = guestId;
            booking.Status = BookingStatus.Pending;
            booking.CreatedAt = DateTime.UtcNow;

            booking.CheckIn = dto.CheckIn.ToUniversalTime();
            booking.CheckOut = dto.CheckOut.ToUniversalTime();

            await _dbContext.Bookings.AddAsync(booking);
            await _dbContext.SaveChangesAsync();

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