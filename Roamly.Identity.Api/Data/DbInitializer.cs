using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;  
using Roamly.Identity.Api.Interfaces;
using Roamly.Identity.Api.Constants;
using Roamly.Identity.Api.Models;

namespace Roamly.Identity.Api.Data
{
    public class DbInitializer : IDbInitializer
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration; 

        public DbInitializer(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration) 
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        public async Task InitializeAsync()
        {
            var roles = Enum.GetNames(typeof(UserRoles));
            foreach (var role in roles)
            {
                if (!await _roleManager.RoleExistsAsync(role))
                {
                    await _roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            var adminEmail = _configuration["AdminSettings:Email"];  
            var adminPassword = _configuration["AdminSettings:Password"];
            if (string.IsNullOrEmpty(adminEmail) || string.IsNullOrEmpty(adminPassword))
            {
                throw new InvalidOperationException($"AdminSettings not configured! Email: {adminEmail}, Password: {adminPassword}");
            }

            var admin = await _userManager.FindByEmailAsync(adminEmail);
            if (admin == null)
            {
                admin = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    EmailConfirmed = true,
                    FirstName = "Admin",
                    LastName = "Roamly",
                    BirthDate = DateOnly.FromDateTime(DateTime.UtcNow.AddYears(-25)),
                    RegistrationDate = DateOnly.FromDateTime(DateTime.UtcNow)
                };
                var result = await _userManager.CreateAsync(admin, adminPassword);
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(admin, UserRoles.Admin.ToString());
                }
            }
        }
    }
}