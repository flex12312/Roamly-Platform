using FluentValidation;
using FluentValidation.AspNetCore;
using Roamly.Identity.Api.DTOs.Requests;

namespace Roamly.Identity.Api.Validators
{
    public class RegisterDtoValidator : AbstractValidator<RegisterRequestDto>
    {
        public RegisterDtoValidator() 
        {
            RuleFor(r => r.Email)
                .NotEmpty()
                   .WithMessage("Почта обязательна")
                .EmailAddress()
                   .WithMessage("Введите валидный email");

            RuleFor(r => r.Password)
                .NotEmpty().WithMessage("Пароль обязателен")
                .MinimumLength(6).WithMessage("Минимум 6 символов")
                .Matches(@"[A-Z]+").WithMessage("Хотя бы одна заглавная латинская буква (A-Z)")
                .Matches(@"[a-z]+").WithMessage("Хотя бы одна строчная латинская буква (a-z)")
                .Matches(@"[0-9]+").WithMessage("Хотя бы одна цифра (0-9)")
                .Matches(@"[!@#$%^&*()_+=\[{\]};:<>|./?,-]").WithMessage("Хотя бы один спецсимвол");

            RuleFor(r => r.ConfirmPassword)
                .NotEmpty().WithMessage("Введите пароль еще раз")
                .Equal(r => r.Password).WithMessage("Пароли не совпадают");

            RuleFor(r => r.FirstName)
                .NotEmpty().WithMessage("Введите имя");

            RuleFor(r => r.LastName)
                .NotEmpty().WithMessage("Введите фамилию");
        }
    }
}