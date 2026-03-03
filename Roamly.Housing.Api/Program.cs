using Microsoft.EntityFrameworkCore;
using Roamly.Housing.Api.Data;



var builder = WebApplication.CreateBuilder(args);
// --- 1. РЕГИСТРАЦИЯ СЕРВИСОВ ---

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Roamly Housing API",
        Version = "v1",
        Description = "Микросервис управления жильём"
    });
});

builder.Services.AddDbContext<HousingDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("HousingDbConnection")));

// --- 2. СБОРКА ПРИЛОЖЕНИЯ ---

var app = builder.Build();

// --- 3. НАСТРОЙКА MIDDLEWARE ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

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
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error during migration.");
        throw;
    }
}

app.Run();