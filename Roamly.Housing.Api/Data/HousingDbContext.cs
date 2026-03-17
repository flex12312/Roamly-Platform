using Microsoft.EntityFrameworkCore;
using Roamly.Housing.Api.Models;

namespace Roamly.Housing.Api.Data
{
    public class HousingDbContext : DbContext
    {
        public DbSet<Amenity> Amenities {  get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Property> Properties { get; set; }
        public DbSet<HouseRules> HouseRules { get; set; }

        public DbSet<PropertyPhoto> PropertyPhotos { get; set; }

        public HousingDbContext(DbContextOptions<HousingDbContext> options) : base(options)
        {

        }
    }
}