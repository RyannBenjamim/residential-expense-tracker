using System;
using System.Collections.Generic;

namespace ControleDeGastos.Api.Models
{
    public class Person
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public int Age { get; set; }
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}