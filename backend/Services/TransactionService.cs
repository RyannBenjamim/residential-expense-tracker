using ControleDeGastos.Api.Data;
using ControleDeGastos.Api.Dtos;
using ControleDeGastos.Api.Exceptions;
using ControleDeGastos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleDeGastos.Api.Services
{
    /// <summary>
    /// Serviço responsável pelas regras de negócio relacionadas às transações financeiras.
    /// </summary>
    public class TransactionService : ITransactionService
    {
        private readonly AppDbContext _context;

        public TransactionService(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retorna todas as transações cadastradas juntamente com o nome da pessoa responsável.
        /// </summary>
        public async Task<IEnumerable<TransactionResponseDto>> GetAllAsync()
        {
            return await _context.Transactions
                .Select(t => new TransactionResponseDto
                {
                    Id = t.Id,
                    Description = t.Description,
                    Amount = t.Amount,
                    Type = t.Type,
                    PersonId = t.PersonId,
                    PersonName = t.Person!.Name
                })
                .ToListAsync();
        }

        /// <summary>
        /// Retorna uma transação a partir do seu identificador.
        /// </summary>
        public async Task<TransactionResponseDto?> GetByIdAsync(Guid id)
        {
            return await _context.Transactions
                .Where(t => t.Id == id)
                .Select(t => new TransactionResponseDto
                {
                    Id = t.Id,
                    Description = t.Description,
                    Amount = t.Amount,
                    Type = t.Type,
                    PersonId = t.PersonId,
                    PersonName = t.Person!.Name
                })
                .FirstOrDefaultAsync();
        }

        /// <summary>
        /// Retorna todas as transações pertencentes a uma pessoa.
        /// </summary>
        public async Task<IEnumerable<TransactionResponseDto>> GetByPersonIdAsync(Guid personId)
        {
            return await _context.Transactions
                .Where(t => t.PersonId == personId)
                .Select(t => new TransactionResponseDto
                {
                    Id = t.Id,
                    Description = t.Description,
                    Amount = t.Amount,
                    Type = t.Type,
                    PersonId = t.PersonId
                })
                .ToListAsync();
        }

        /// <summary>
        /// Cria uma nova transação após validar as regras de negócio.
        /// </summary>
        public async Task<TransactionResponseDto> CreateAsync(TransactionCreateDto dto)
        {
            // Garante que a transação será vinculada a uma pessoa existente.
            var person = await _context.People.FindAsync(dto.PersonId);

            if (person == null)
            {
                throw new ResourceNotFoundException("The specified person does not exist.");
            }

            // Regra de negócio:
            // Pessoas menores de 18 anos podem registrar apenas despesas.
            if (person.Age < 18 && dto.Type == TransactionType.Income)
            {
                throw new BusinessException("Underage individuals (under 18) can only register expenses.");
            }

            var transaction = new Transaction
            {
                Description = dto.Description,
                Amount = dto.Amount,
                Type = dto.Type,
                PersonId = dto.PersonId
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return new TransactionResponseDto
            {
                Id = transaction.Id,
                Description = transaction.Description,
                Amount = transaction.Amount,
                Type = transaction.Type,
                PersonId = transaction.PersonId,
                PersonName = person.Name
            };
        }

        /// <summary>
        /// Remove uma transação cadastrada a partir do seu identificador.
        /// </summary>
        public async Task DeleteAsync(Guid id)
        {
            var transaction = await _context.Transactions.FindAsync(id);

            if (transaction == null)
            {
                throw new ResourceNotFoundException("Transaction not found.");
            }

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();
        }
    }
}