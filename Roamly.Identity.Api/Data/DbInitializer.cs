using Microsoft.AspNetCore.Identity;
using Roamly.Identity.Api.Constants;
using Roamly.Identity.Api.Interfaces;
using Roamly.Identity.Api.Models;

namespace Roamly.Identity.Api.Data
{
    public class DbInitializer : IDbInitializer
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;
        public DbInitializer(RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        public void Initialize()
        {
            if (!_roleManager.RoleExistsAsync(UserRoles.Admin.ToString()).GetAwaiter().GetResult())
            {
                _roleManager.CreateAsync(new IdentityRole(UserRoles.Admin.ToString())).GetAwaiter().GetResult();
                _roleManager.CreateAsync(new IdentityRole(UserRoles.Member.ToString())).GetAwaiter().GetResult();
                _roleManager.CreateAsync(new IdentityRole(UserRoles.Verified.ToString())).GetAwaiter().GetResult();

                var admin = new ApplicationUser()
                {
                    UserName = "admin@roamly.com",
                    FirstName = "Admin",
                    LastName = "Roamly",
                    Email = "admin@roamly.com",
                    EmailConfirmed = true,
                    BirthDate = new DateOnly(1990, 1, 1)
                };

                _userManager.CreateAsync(admin, "Admin123*").GetAwaiter().GetResult();
                _userManager.AddToRoleAsync(admin, UserRoles.Admin.ToString()).GetAwaiter().GetResult();
            }
        }
    }
}