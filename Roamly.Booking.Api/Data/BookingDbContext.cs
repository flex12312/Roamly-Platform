using Microsoft.EntityFrameworkCore;
using BookingEntity = Roamly.Booking.Api.Models.Booking;


namespace Roamly.Booking.Api.Data
{
    public class BookingDbContext : DbContext
    {
        public DbSet<BookingEntity> Bookings { get; set; }

        public BookingDbContext(DbContextOptions<BookingDbContext> options) : base(options) { }

    }
}