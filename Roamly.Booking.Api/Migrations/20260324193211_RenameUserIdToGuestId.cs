using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Roamly.Booking.Api.Migrations
{
    /// <inheritdoc />
    public partial class RenameUserIdToGuestId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Bookings",
                newName: "GuestId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "GuestId",
                table: "Bookings",
                newName: "UserId");
        }
    }
}
