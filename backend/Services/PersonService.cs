using ControleDeGastos.Api.Data;
using ControleDeGastos.Api.Dtos;
using ControleDeGastos.Api.Exceptions;
using ControleDeGastos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleDeGastos.Api.Services
{
    /// <summary>
    /// Serviço responsável pelas regras de negócio relacionadas ao cadastro de pessoas
    /// e ao cálculo dos totais financeiros.
    /// </summary>
    public class PersonService : IPersonService
    {
        private readonly AppDbContext _context;

        public PersonService(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retorna todas as pessoas cadastradas juntamente com seus totais
        /// de receitas, despesas e saldo.
        /// </summary>
        public async Task<IEnumerable<PersonResponseDto>> GetAllAsync()
        {
            var people = await _context.People.ToListAsync();
            var transactions = await _context.Transactions.ToListAsync();

            // Calcula o resumo financeiro de cada pessoa a partir das
            // transações cadastradas no sistema.
            return people.Select(p =>
            {
                var personTransactions = transactions.Where(t => t.PersonId == p.Id).ToList();

                var income = personTransactions
                    .Where(t => t.Type == TransactionType.Income)
                    .Sum(t => t.Amount);

                var expenses = personTransactions
                    .Where(t => t.Type == TransactionType.Expense)
                    .Sum(t => t.Amount);

                return new PersonResponseDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Age = p.Age,
                    TotalIncome = income,
                    TotalExpenses = expenses,
                    Balance = income - expenses
                };
            });
        }

        /// <summary>
        /// Retorna uma pessoa juntamente com seu resumo financeiro.
        /// </summary>
        public async Task<PersonResponseDto?> GetByIdAsync(Guid id)
        {
            var person = await _context.People.FindAsync(id);

            if (person == null)
            {
                return null;
            }

            var personTransactions = await _context.Transactions
                .Where(t => t.PersonId == id)
                .ToListAsync();

            var income = personTransactions
                .Where(t => t.Type == TransactionType.Income)
                .Sum(t => t.Amount);

            var expenses = personTransactions
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

        /// <summary>
        /// Cadastra uma nova pessoa no sistema.
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

        /// <summary>
        /// Remove uma pessoa cadastrada.
        /// As transações vinculadas também são removidas pela exclusão em cascata
        /// configurada no banco de dados.
        /// </summary>
        public async Task<bool> DeleteAsync(Guid id)
        {
            var person = await _context.People.FindAsync(id);

            if (person == null)
            {
                throw new ResourceNotFoundException("The specified person does not exist.");
            }

            _context.People.Remove(person);
            await _context.SaveChangesAsync();

            return true;
        }

        /// <summary>
        /// Retorna o resumo financeiro consolidado do sistema,
        /// contendo os totais por pessoa e os totais gerais.
        /// </summary>
        public async Task<DashboardResponseDto> GetDashboardAsync()
        {
            var people = await _context.People.ToListAsync();
            var transactions = await _context.Transactions.ToListAsync();

            // Monta o resumo financeiro individual de cada pessoa.
            var peopleDtos = people.Select(p =>
            {
                var personTransactions = transactions.Where(t => t.PersonId == p.Id).ToList();

                var income = personTransactions
                    .Where(t => t.Type == TransactionType.Income)
                    .Sum(t => t.Amount);

                var expenses = personTransactions
                    .Where(t => t.Type == TransactionType.Expense)
                    .Sum(t => t.Amount);

                return new PersonResponseDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Age = p.Age,
                    TotalIncome = income,
                    TotalExpenses = expenses,
                    Balance = income - expenses
                };
            }).ToList();

            // Calcula os totais gerais exibidos no dashboard.
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
    }
}