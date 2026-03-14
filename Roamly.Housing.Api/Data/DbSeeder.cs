using Roamly.Housing.Api.Models;

namespace Roamly.Housing.Api.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(HousingDbContext context)
        {
            if (!context.Amenities.Any())
            {
                context.Amenities.AddRange(
                    new Amenity { Id = 1, Name = "WiFi", Icon = "wifi", Description = "Бесплатный WiFi" },
                    new Amenity { Id = 2, Name = "Парковка", Icon = "parking", Description = "Бесплатная парковка" },
                    new Amenity { Id = 3, Name = "Кондиционер", Icon = "ac", Description = "Кондиционер" },
                    new Amenity { Id = 4, Name = "Кухня", Icon = "kitchen", Description = "Полноценная кухня" },
                    new Amenity { Id = 5, Name = "Стиральная машина", Icon = "washer", Description = "Стиральная машина" },
                    new Amenity { Id = 6, Name = "Бассейн", Icon = "pool", Description = "Бассейн" },
                    new Amenity { Id = 7, Name = "Терраса", Icon = "terrace", Description = "Терраса или балкон" },
                    new Amenity { Id = 8, Name = "Телевизор", Icon = "tv", Description = "Телевизор с кабельным ТВ" }
                );
                await context.SaveChangesAsync();
            }
        }
    }
}