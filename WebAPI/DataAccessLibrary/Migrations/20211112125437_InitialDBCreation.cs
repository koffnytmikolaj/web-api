using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DataAccessLibrary.Migrations
{
    public partial class InitialDBCreation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Industries",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IndustryName = table.Column<string>(maxLength: 32, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Industries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleName = table.Column<string>(maxLength: 32, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(maxLength: 32, nullable: true),
                    Surname = table.Column<string>(maxLength: 32, nullable: true),
                    DateOfBirth = table.Column<DateTime>(nullable: false),
                    Login = table.Column<string>(maxLength: 32, nullable: true),
                    Password = table.Column<string>(maxLength: 256, nullable: true),
                    RoleId = table.Column<int>(nullable: false),
                    IsDeleted = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "Companies",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(maxLength: 32, nullable: false),
                    Nip = table.Column<string>(type: "char(10)", maxLength: 10, nullable: false),
                    IndustryId = table.Column<int>(nullable: false),
                    Address = table.Column<string>(maxLength: 32, nullable: false),
                    Localization = table.Column<string>(maxLength: 32, nullable: false),
                    AddingCompanyUserId = table.Column<int>(nullable: false),
                    DateOfAdd = table.Column<DateTime>(nullable: false),
                    IsDeleted = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Companies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Companies_Users_AddingCompanyUserId",
                        column: x => x.AddingCompanyUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_Companies_Industries_IndustryId",
                        column: x => x.IndustryId,
                        principalTable: "Industries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "ContactPersons",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(maxLength: 32, nullable: false),
                    Surname = table.Column<string>(maxLength: 32, nullable: false),
                    PhoneNumber = table.Column<string>(type: "char(9)", maxLength: 9, nullable: false),
                    Email = table.Column<string>(maxLength: 32, nullable: false),
                    JobTitle = table.Column<string>(maxLength: 32, nullable: false),
                    RelatedCompanyId = table.Column<int>(nullable: false),
                    AddingPersonUserId = table.Column<int>(nullable: false),
                    IsDeleted = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactPersons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContactPersons_Users_AddingPersonUserId",
                        column: x => x.AddingPersonUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_ContactPersons_Companies_RelatedCompanyId",
                        column: x => x.RelatedCompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "TradeNotes",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NoteContent = table.Column<string>(maxLength: 512, nullable: false),
                    IsDeleted = table.Column<bool>(nullable: false),
                    RelatedCompanyId = table.Column<int>(nullable: false),
                    AddingNoteUserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TradeNotes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TradeNotes_Users_AddingNoteUserId",
                        column: x => x.AddingNoteUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_TradeNotes_Companies_RelatedCompanyId",
                        column: x => x.RelatedCompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Companies_AddingCompanyUserId",
                table: "Companies",
                column: "AddingCompanyUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_IndustryId",
                table: "Companies",
                column: "IndustryId");

            migrationBuilder.CreateIndex(
                name: "IX_ContactPersons_AddingPersonUserId",
                table: "ContactPersons",
                column: "AddingPersonUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ContactPersons_RelatedCompanyId",
                table: "ContactPersons",
                column: "RelatedCompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_TradeNotes_AddingNoteUserId",
                table: "TradeNotes",
                column: "AddingNoteUserId");

            migrationBuilder.CreateIndex(
                name: "IX_TradeNotes_RelatedCompanyId",
                table: "TradeNotes",
                column: "RelatedCompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_RoleId",
                table: "Users",
                column: "RoleId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContactPersons");

            migrationBuilder.DropTable(
                name: "TradeNotes");

            migrationBuilder.DropTable(
                name: "Companies");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Industries");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}
