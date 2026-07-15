using System;
using System.Collections.Generic;

namespace ControleDeGastos.Api.Models
{
    public class Pessoa
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public string Nome { get; set; } = string.Empty;
        
        public int Idade { get; set; }

        public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
    }
}