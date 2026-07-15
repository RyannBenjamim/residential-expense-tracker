using ControleDeGastos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleDeGastos.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Person> People { get; set; } = null!;
        public DbSet<Transaction> Transactions { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Person>()
                .HasMany(p => p.Transactions)
                .WithOne(t => t.Person)
                .HasForeignKey(t => t.PersonId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}