using System;
using System.Text.Json.Serialization;
using ControleDeGastos.Api.Models;

namespace ControleDeGastos.Api.Dtos
{
    public class TransactionResponseDto
    {
        public Guid Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TransactionType Type { get; set; }
        public Guid PersonId { get; set; }
        public string PersonName { get; set; } = string.Empty;
    }
}