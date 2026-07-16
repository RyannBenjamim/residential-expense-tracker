using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using ControleDeGastos.Api.Models;

namespace ControleDeGastos.Api.Dtos
{
    public class TransactionCreateDto
    {
        [Required(ErrorMessage = "Description is required.")]
        [StringLength(200, ErrorMessage = "Description must be at most 200 characters long.")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Amount is required.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than zero.")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Transaction type (Income or Expense) is required.")]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TransactionType Type { get; set; }

        [Required(ErrorMessage = "PersonId is required to associate this transaction.")]
        public Guid PersonId { get; set; }
    }
}