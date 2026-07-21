using System.Text.Json.Serialization;

namespace ControleDeGastos.Api.Models
{
    /// <summary>
    /// Define os tipos possíveis de movimentação financeira.
    /// </summary>
    public enum TransactionType
    {
        Income,
        Expense
    }

    /// <summary>
    /// Representa uma transação financeira vinculada a uma pessoa.
    /// </summary>
    public class Transaction
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Description { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TransactionType Type { get; set; }

        public Guid PersonId { get; set; }

        // Evita referência circular durante a serialização JSON.
        [JsonIgnore]
        public Person? Person { get; set; }
    }
}