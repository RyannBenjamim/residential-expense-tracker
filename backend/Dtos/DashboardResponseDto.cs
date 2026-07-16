using System.Collections.Generic;

namespace ControleDeGastos.Api.Dtos
{
    public class DashboardResponseDto
    {
        public IEnumerable<PersonResponseDto> People { get; set; } = new List<PersonResponseDto>();

        public decimal GeneralIncome { get; set; }   
        public decimal GeneralExpenses { get; set; }
        public decimal NetBalance { get; set; }     
    }
}