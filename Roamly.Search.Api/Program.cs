using Microsoft.EntityFrameworkCore;
using Roamly.Housing.Api.Data;
using Roamly.Search.Api.Interfaces;
using Roamly.Search.Api.Services;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

//Сервисы
builder.Services.AddControllers();
builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//База данных (та же что и Housing!)
builder.Services.AddDbContext<HousingDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("SearchDbConnection")));

//Dependency Injection
builder.Services.AddScoped<ISearchService, SearchService>();

//CORS 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

//Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();