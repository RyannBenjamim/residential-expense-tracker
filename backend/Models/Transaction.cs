using System;
using System.Text.Json.Serialization;

namespace ControleDeGastos.Api.Models
{
    public enum TransactionType
    {
        Income,
        Expense
    }

    public class Transaction
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public string Description { get; set; } = string.Empty;
        
        public decimal Amount { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TransactionType Type { get; set; }

        public Guid PersonId { get; set; }
        
        [JsonIgnore]
        public Person? Person { get; set; }
    }
}