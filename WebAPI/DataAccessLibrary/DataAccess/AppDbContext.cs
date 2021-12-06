using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccessLibrary.Models;

namespace DataAccessLibrary.DataAccess
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) { }

        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Industry> Industries { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<TradeNote> TradeNotes { get; set; }
        public DbSet<ContactPerson> ContactPersons { get; set; }
    }
}
