using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Roamly.Identity.Api.Data; 
using Roamly.Identity.Api.Models;

var builder = WebApplication.CreateBuilder(args);

// --- 1. ĞÅÃÈÑÒĞÀÖÈß ÑÅĞÂÈÑÎÂ (DI Container) ---

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Ğåãèñòğàöèÿ ÁÄ
builder.Services.AddDbContext<IdentityDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("IdentityDbConnection")));

// Ğåãèñòğàöèÿ Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<IdentityDbContext>()
    .AddDefaultTokenProviders();

// --- 2. ÑÁÎĞÊÀ ÏĞÈËÎÆÅÍÈß ---

var app = builder.Build();

// --- 3. ÍÀÑÒĞÎÉÊÀ MIDDLEWARE (Pipeline) ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();