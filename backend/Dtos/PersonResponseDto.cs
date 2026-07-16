using System;

namespace ControleDeGastos.Api.Dtos
{
    public class PersonResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Age { get; set; }
        public decimal TotalExpenses { get; set; }
    }
}