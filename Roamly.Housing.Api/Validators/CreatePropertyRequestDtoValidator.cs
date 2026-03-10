using FluentValidation;
using Roamly.Housing.Api.DTOs.Requests;

namespace Roamly.Housing.Api.Validators
{
    public class CreatePropertyRequestDtoValidator : AbstractValidator<CreatePropertyRequestDto>
    {
        public CreatePropertyRequestDtoValidator()
        {
            RuleFor(p => p.Title)
                .NotEmpty().WithMessage("Заголовок обязателен")
                .MinimumLength(5).WithMessage("Минимум 5 символов")
                .MaximumLength(100).WithMessage("Максимум 100 символов");

            RuleFor(r => r.Description)
                .NotEmpty().WithMessage("Описание обязательно")
                .MinimumLength(10).WithMessage("Минимум 10 символов")
                .MaximumLength(1000).WithMessage("Максимум 1000 символов");

            RuleFor(r => r.PricePerNight)
                .GreaterThan(0).WithMessage("Цена должна быть больше 0");

            RuleFor(r => r.MaxGuests)
                .InclusiveBetween(1, 50).WithMessage("Максимум гостей от 1 до 50");

            RuleFor(r => r.Bedrooms)
                .GreaterThan(0).WithMessage("Количество спален должно быть больше 0");

            RuleFor(r => r.Bathrooms)
                .GreaterThan(0).WithMessage("Количество ванн должно быть больше 0");

            RuleFor(r => r.LocationId)
                .GreaterThan(0).WithMessage("ID локации должен быть больше 0")
                .When(r => r.LocationId.HasValue);
        }
    }
}