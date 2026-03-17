using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Roamly.Housing.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddHouseRules : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HouseRules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PropertyId = table.Column<int>(type: "integer", nullable: false),
                    SmokingAllowed = table.Column<bool>(type: "boolean", nullable: false),
                    PetsAllowed = table.Column<bool>(type: "boolean", nullable: false),
                    ChildrenAllowed = table.Column<bool>(type: "boolean", nullable: false),
                    CheckInFrom = table.Column<TimeSpan>(type: "interval", nullable: true),
                    CheckOutBefore = table.Column<TimeSpan>(type: "interval", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HouseRules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HouseRules_Properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "Properties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HouseRules_PropertyId",
                table: "HouseRules",
                column: "PropertyId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HouseRules");
        }
    }
}
