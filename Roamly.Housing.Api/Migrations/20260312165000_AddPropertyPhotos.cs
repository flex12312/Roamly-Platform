using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Roamly.Housing.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPropertyPhotos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ContentType",
                table: "PropertyPhotos",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContentType",
                table: "PropertyPhotos");
        }
    }
}
