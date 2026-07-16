using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ControleDeGastos.Api.Dtos;

namespace ControleDeGastos.Api.Services
{
    public interface ITransactionService
    {
        Task<IEnumerable<TransactionResponseDto>> GetAllAsync();
        Task<TransactionResponseDto?> GetByIdAsync(Guid id);
        Task<TransactionResponseDto> CreateAsync(TransactionCreateDto dto);
    }
}