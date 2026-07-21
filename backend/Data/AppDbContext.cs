using ControleDeGastos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleDeGastos.Api.Data
{
    /// <summary>
    /// Contexto principal de acesso aos dados da aplicação.
    /// Responsável pelo mapeamento das entidades e configurações do banco.
    /// </summary>
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Person> People { get; set; } = null!;

        public DbSet<Transaction> Transactions { get; set; } = null!;

        /// <summary>
        /// Configura os relacionamentos e regras de persistência das entidades.
        /// </summary>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Define o relacionamento entre pessoa e transações.
            // Ao remover uma pessoa, todas as suas transações associadas
            // também serão removidas automaticamente.
            modelBuilder.Entity<Person>()
                .HasMany(p => p.Transactions)
                .WithOne(t => t.Person)
                .HasForeignKey(t => t.PersonId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}