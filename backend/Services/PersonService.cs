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

        public async Task<IEnumerable<PersonResponseDto>> GetAllAsync()
        {
            var people = await _context.People.ToListAsync();

            return people.Select(p => new PersonResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                Age = p.Age,
                TotalIncome = 0,
                TotalExpenses = 0,
                Balance = 0
            });
        }

        public async Task<PersonResponseDto?> GetByIdAsync(Guid id)
        {
            var person = await _context.People.FindAsync(id);
            if (person == null) return null;

            return new PersonResponseDto
            {
                Id = person.Id,
                Name = person.Name,
                Age = person.Age,
                TotalIncome = 0,
                TotalExpenses = 0,
                Balance = 0
            };
        }

        public async Task<PersonResponseDto> CreateAsync(PersonCreateDto dto)
        {
            var person = new Person
            {
                Name = dto.Name,
                Age = dto.Age
            };

            _context.People.Add(person);
            await _context.SaveChangesAsync();

            return new PersonResponseDto
            {
                Id = person.Id,
                Name = person.Name,
                Age = person.Age,
                TotalIncome = 0,
                TotalExpenses = 0,
                Balance = 0
            };
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var person = await _context.People.FindAsync(id);
            if (person == null) return false;

            _context.People.Remove(person);
            await _context.SaveChangesAsync();
            return true;
        }

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

        private static PersonResponseDto MapToResponseDto(Person person)
        {
            var transactions = person.Transactions ?? new List<Transaction>();

            var income = transactions
                .Where(t => t.Type == TransactionType.Income)
                .Sum(t => t.Amount);

            var expenses = transactions
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