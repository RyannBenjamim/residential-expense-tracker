using ControleDeGastos.Api.Dtos;
using ControleDeGastos.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleDeGastos.Api.Controllers
{
    /// <summary>
    /// Controller responsável pelo gerenciamento de pessoas
    /// e consulta dos seus dados financeiros.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class PeopleController : ControllerBase
    {
        private readonly IPersonService _personService;

        public PeopleController(IPersonService personService)
        {
            _personService = personService;
        }

        /// <summary>
        /// Retorna todas as pessoas cadastradas juntamente com seus totais financeiros.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PersonResponseDto>>> GetAll()
        {
            var people = await _personService.GetAllAsync();

            return Ok(people);
        }

        /// <summary>
        /// Retorna uma pessoa específica através do seu identificador.
        /// </summary>
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<PersonResponseDto>> GetById(Guid id)
        {
            var person = await _personService.GetByIdAsync(id);

            if (person == null)
            {
                return Problem(
                    detail: "Person not found.",
                    statusCode: StatusCodes.Status404NotFound
                );
            }

            return Ok(person);
        }

        /// <summary>
        /// Cadastra uma nova pessoa no sistema.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<PersonResponseDto>> Create(
            [FromBody] PersonCreateDto dto)
        {
            var createdPerson = await _personService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = createdPerson.Id },
                createdPerson
            );
        }

        /// <summary>
        /// Remove uma pessoa cadastrada.
        /// As transações associadas são removidas conforme a regra
        /// de exclusão configurada na persistência dos dados.
        /// </summary>
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _personService.DeleteAsync(id);

            return NoContent();
        }

        /// <summary>
        /// Retorna o resumo financeiro geral do sistema,
        /// incluindo os totais individuais e consolidados.
        /// </summary>
        [HttpGet("dashboard")]
        public async Task<ActionResult<DashboardResponseDto>> GetDashboard()
        {
            var dashboard = await _personService.GetDashboardAsync();

            return Ok(dashboard);
        }
    }
}