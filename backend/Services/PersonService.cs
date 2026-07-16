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
    public class PersonService : IPersonService
    {
        private readonly AppDbContext _context;

        public PersonService(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retorna a lista de pessoas cadastradas.
        /// </summary>
        public async Task<IEnumerable<PersonResponseDto>> GetAllAsync()
        {
            var people = await _context.People
                .Include(p => p.Transactions)
                .ToListAsync();

            return people.Select(p => MapToResponseDto(p));
        }

        /// <summary>
        /// Busca uma pessoa específica pelo ID.
        /// </summary>
        public async Task<PersonResponseDto?> GetByIdAsync(Guid id)
        {
            var person = await _context.People
                .Include(p => p.Transactions)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (person == null) return null;

            return MapToResponseDto(person);
        }

        /// <summary>
        /// Cadastra uma nova pessoa no banco de dados.
        /// </summary>
        public async Task<PersonResponseDto> CreateAsync(PersonCreateDto dto)
        {
            var person = new Person
            {
                Name = dto.Name,
                Age = dto.Age
            };

            _context.People.Add(person);
            await _context.SaveChangesAsync();

            return MapToResponseDto(person);
        }

        /// <summary>
        /// Exclui uma pessoa do banco. Por causa da configuração no DbContext,
        /// todas as transações dela serão excluídas automaticamente do banco de dados.
        /// </summary>
        public async Task<bool> DeleteAsync(Guid id)
        {
            var person = await _context.People.FindAsync(id);
            if (person == null) return false;

            _context.People.Remove(person);
            await _context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Consolida os saldos individuais de cada pessoa e soma os totais gerais da residência.
        /// </summary>
        public async Task<DashboardResponseDto> GetDashboardAsync()
        {
            var peopleFromDb = await _context.People
                .Include(p => p.Transactions)
                .ToListAsync();

            var peopleDtos = peopleFromDb.Select(p => MapToResponseDto(p)).ToList();

            decimal generalIncome = peopleDtos.Sum(p => p.TotalIncome);
            decimal generalExpenses = peopleDtos.Sum(p => p.TotalExpenses);

            return new DashboardResponseDto
            {
                People = peopleDtos,
                GeneralIncome = generalIncome,
                GeneralExpenses = generalExpenses,
                NetBalance = generalIncome - generalExpenses
            };
        }

        // Método auxiliar privado para centralizar o cálculo financeiro e mapeamento
        private static PersonResponseDto MapToResponseDto(Person person)
        {
            var income = person.Transactions
                .Where(t => t.Type == TransactionType.Income)
                .Sum(t => t.Amount);

            var expenses = person.Transactions
                .Where(t => t.Type == TransactionType.Expense)
                .Sum(t => t.Amount);

            return new PersonResponseDto
            {
                Id = person.Id,
                Name = person.Name,
                Age = person.Age,
                TotalIncome = income,
                TotalExpenses = expenses,
                Balance = income - expenses
            };
        }
    }
}