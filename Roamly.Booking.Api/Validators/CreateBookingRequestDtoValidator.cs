using FluentValidation;
using Roamly.Booking.Api.DTOs.Requests;

namespace Roamly.Booking.Api.Validators
{
    public class CreateBookingRequestDtoValidator : AbstractValidator<CreateBookingRequestDto>
    {
        public CreateBookingRequestDtoValidator()
        {
            RuleFor(x => x.PropertyId)
               .GreaterThan(0).WithMessage("ID жилья обязателен");

            RuleFor(x => x.Guests)
                .GreaterThan(0).WithMessage("Количество гостей должно быть больше 0");

            RuleFor(x => x.CheckIn)
                .GreaterThanOrEqualTo(DateTime.UtcNow).WithMessage("Дата заезда не может быть в прошлом");

            RuleFor(x => x.CheckOut)
                .GreaterThan(x => x.CheckIn).WithMessage("Дата выезда должна быть позже даты заезда");
        }
    }
}