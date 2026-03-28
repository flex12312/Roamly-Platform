using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Roamly.Booking.Api.DTOs.Requests;
using Roamly.Booking.Api.DTOs.Responses;
using Roamly.Booking.Api.Interfaces;
using Roamly.Booking.Api.Models;
using System.Security.Claims;

namespace Roamly.Booking.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        public BookingController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpPost("{id}/cancel")]
        public async Task<IActionResult> CancelBooking(int id, [FromBody] CancelBookingRequestDto dto)
        {
            var res = await _bookingService.CancelBookingAsync(dto, id);
            if(!res) return NotFound(new { message = "Бронь не найдена" });

            return Ok(new { message = "Бронь успешно отменена"});
        }

        [HttpPost]
        public async Task<ActionResult<BookingResponseDto>> CreateBooking(CreateBookingRequestDto dto)
        {
            var guestId =  User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(guestId)) return Unauthorized(new { message = "User ID не найден" });
            var res = await _bookingService.CreateBookingAsync(dto, guestId);
            if (res == null) return BadRequest();

            return CreatedAtAction(nameof(GetBookingById), new { id = res.Id }, res);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BookingResponseDto>> GetBookingById(int id)
        {
            var res = await _bookingService.GetBookingByIdAsync(id);
            if (res == null) return NotFound(new { message = "Бронь не найдена" });

            return Ok(res);
        }

        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<BookingResponseDto>>> GetUserBookings()
        {
            var guestId = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(guestId)) return Unauthorized(new { message = "User ID не найден" });
            var res = await _bookingService.GetUserBookingsAsync(guestId);

            return Ok(res);
        }
    }
}