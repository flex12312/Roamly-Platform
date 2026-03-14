using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Roamly.Housing.Api.Data;
using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using System.Reflection;
using Roamly.Housing.Api.Interfaces;
using Roamly.Housing.Api.Services;




var builder = WebApplication.CreateBuilder(args);
// --- 1. –≈√»—“–¿÷»ﬂ —≈–¬»—Œ¬ ---

builder.Services.AddControllers();
builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());
builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
builder.Services.AddFluentValidationAutoValidation();

builder.Services.AddScoped<IPropertyService, PropertyService>();
builder.Services.AddScoped<IPropertyPhotoService, PropertyPhotoService>();
builder.Services.AddScoped<IAmenityService, AmenityService>();



builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Roamly Housing API",
        Version = "v1"
    });

    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});



builder.Services.AddDbContext<HousingDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("HousingDbConnection")));

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(opt =>
{
    opt.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});


// --- 2. —¡Œ– ¿ œ–»ÀŒ∆≈Õ»ﬂ ---

var app = builder.Build();

// --- 3. Õ¿—“–Œ… ¿ MIDDLEWARE ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseAuthentication();  
app.UseAuthorization();  

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    try
    {
        logger.LogInformation("Applying migrations...");
        var context = services.GetRequiredService<HousingDbContext>();
        await context.Database.MigrateAsync();
        logger.LogInformation("Migrations applied successfully!");

        logger.LogInformation("Seeding database...");
        await DbSeeder.SeedAsync(context);
        logger.LogInformation("Database seeded successfully!");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error during migration.");
        throw;
    }
}

app.Run();