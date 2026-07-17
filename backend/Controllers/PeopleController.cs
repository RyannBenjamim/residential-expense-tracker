using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ControleDeGastos.Api.Dtos;
using ControleDeGastos.Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ControleDeGastos.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PeopleController : ControllerBase
    {
        private readonly IPersonService _personService;

        public PeopleController(IPersonService personService)
        {
            _personService = personService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PersonResponseDto>>> GetAll()
        {
            var people = await _personService.GetAllAsync();
            return Ok(people);
        }

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

        [HttpPost]
        public async Task<ActionResult<PersonResponseDto>> Create([FromBody] PersonCreateDto dto)
        {
            var createdPerson = await _personService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = createdPerson.Id }, createdPerson);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _personService.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("dashboard")]
        public async Task<ActionResult<DashboardResponseDto>> GetDashboard()
        {
            var dashboard = await _personService.GetDashboardAsync();
            return Ok(dashboard);
        }
    }
}