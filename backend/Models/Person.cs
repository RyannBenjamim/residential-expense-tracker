namespace ControleDeGastos.Api.Models
{
    /// <summary>
    /// Representa uma pessoa cadastrada no sistema.
    /// </summary>
    public class Person
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Name { get; set; } = string.Empty;

        public int Age { get; set; }

        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}