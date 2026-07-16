using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ControleDeGastos.Api.Data;
using ControleDeGastos.Api.Dtos;
using ControleDeGastos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleDeGastos.Api.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly AppDbContext _context;

        public TransactionService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TransactionResponseDto>> GetAllAsync()
        {
            return await _context.Transactions
                .Include(t => t.Person)
                .Select(t => new TransactionResponseDto
                {
                    Id = t.Id,
                    Description = t.Description,
                    Amount = t.Amount,
                    Type = t.Type,
                    PersonId = t.PersonId,
                    PersonName = t.Person != null ? t.Person.Name : "Unknown"
                })
                .ToListAsync();
        }

        public async Task<TransactionResponseDto?> GetByIdAsync(Guid id)
        {
            var transaction = await _context.Transactions
                .Include(t => t.Person)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (transaction == null) return null;

            return new TransactionResponseDto
            {
                Id = transaction.Id,
                Description = transaction.Description,
                Amount = transaction.Amount,
                Type = transaction.Type,
                PersonId = transaction.PersonId,
                PersonName = transaction.Person != null ? transaction.Person.Name : "Unknown"
            };
        }

        public async Task<TransactionResponseDto> CreateAsync(TransactionCreateDto dto)
        {
            var person = await _context.People.FindAsync(dto.PersonId);
            if (person == null)
            {
                throw new ArgumentException("The specified person does not exist.");
            }

            if (person.Age < 18 && dto.Type == TransactionType.Income)
            {
                throw new InvalidOperationException("Underage individuals (under 18) can only register expenses.");
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
    }
}