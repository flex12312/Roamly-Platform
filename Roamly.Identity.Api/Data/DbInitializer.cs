using Microsoft.AspNetCore.Identity;
using Roamly.Identity.Api.Constants;
using Roamly.Identity.Api.Interfaces;
using Roamly.Identity.Api.Models;
using Microsoft.Extensions.Configuration;

namespace Roamly.Identity.Api.Data
{
    public class DbInitializer : IDbInitializer
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _config;
        public DbInitializer(RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager,
            IConfiguration config)  
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _config = config;  
        }

        public async Task InitializeAsync()
        {
            var roles = new[] { UserRoles.Admin, UserRoles.Member, UserRoles.Verified };
            foreach (var role in roles)
            {
                if (!await _roleManager.RoleExistsAsync(role.ToString()))
                {
                    await _roleManager.CreateAsync(new IdentityRole(role.ToString()));
                }
            }
            var adminEmail = _config["ADMIN_EMAIL"];
            var adminPassword = _config["ADMIN_PASSWORD"] ?? throw new InvalidOperationException("ADMIN_PASSWORD is not set"); 
            if (await _userManager.FindByEmailAsync(adminEmail) is null)
            {
                var admin = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FirstName = "Admin",
                    LastName = "Roamly",
                    EmailConfirmed = true,
                    BirthDate = new DateOnly(1990, 1, 1)
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