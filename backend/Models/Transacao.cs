using System;
using System.Text.Json.Serialization;

namespace ControleDeGastos.Api.Models
{
    public enum TipoTransacao
    {
        Receita,
        Despesa
    }

    public class Transacao
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public string Descricao { get; set; } = string.Empty;
        
        public decimal Valor { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TipoTransacao Tipo { get; set; }

        public Guid PessoaId { get; set; }
        
        [JsonIgnore]
        public Pessoa? Pessoa { get; set; }
    }
}