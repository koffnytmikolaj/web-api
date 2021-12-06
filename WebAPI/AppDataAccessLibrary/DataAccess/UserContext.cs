using Microsoft.EntityFrameworkCore;
using AppDataAccessLibrary.Models;

namespace AppDataAccessLibrary.DataAccess
{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Industry> Industries { get; set; }
        public DbSet<TradeNote> TradeNotes { get; set; }
        public DbSet<ContactPerson> ContactPersons { get; set; }

    }
}
