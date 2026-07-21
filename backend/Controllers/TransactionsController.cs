using ControleDeGastos.Api.Dtos;
using ControleDeGastos.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleDeGastos.Api.Controllers
{
    /// <summary>
    /// Controller responsável pelo gerenciamento das transações financeiras.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionService _transactionService;

        public TransactionsController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        /// <summary>
        /// Retorna todas as transações cadastradas.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransactionResponseDto>>> GetAll()
        {
            var transactions = await _transactionService.GetAllAsync();

            return Ok(transactions);
        }

        /// <summary>
        /// Retorna uma transação específica através do seu identificador.
        /// </summary>
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<TransactionResponseDto>> GetById(Guid id)
        {
            var transaction = await _transactionService.GetByIdAsync(id);

            if (transaction == null)
            {
                return Problem(
                    detail: "Transaction not found.",
                    statusCode: StatusCodes.Status404NotFound
                );
            }

            return Ok(transaction);
        }

        /// <summary>
        /// Retorna todas as transações vinculadas a uma pessoa específica.
        /// </summary>
        [HttpGet("person/{personId:guid}")]
        public async Task<ActionResult<IEnumerable<TransactionResponseDto>>> GetByPersonId(Guid personId)
        {
            var transactions = await _transactionService.GetByPersonIdAsync(personId);

            return Ok(transactions);
        }

        /// <summary>
        /// Cadastra uma nova transação financeira.
        /// As regras de negócio são validadas pelo serviço responsável.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<TransactionResponseDto>> Create(
            [FromBody] TransactionCreateDto dto)
        {
            var createdTransaction = await _transactionService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = createdTransaction.Id },
                createdTransaction
            );
        }

        /// <summary>
        /// Remove uma transação existente pelo seu identificador.
        /// </summary>
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _transactionService.DeleteAsync(id);

            return NoContent();
        }
    }
}