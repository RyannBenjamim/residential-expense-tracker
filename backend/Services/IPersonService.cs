using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ControleDeGastos.Api.Dtos;

namespace ControleDeGastos.Api.Services
{
    public interface IPersonService
    {
        Task<IEnumerable<PersonResponseDto>> GetAllAsync();
        Task<PersonResponseDto?> GetByIdAsync(Guid id);
        Task<PersonResponseDto> CreateAsync(PersonCreateDto dto);
        Task<bool> DeleteAsync(Guid id);
        
        // Método responsável por gerar os dados consolidados do Módulo 3
        Task<DashboardResponseDto> GetDashboardAsync();
    }
}