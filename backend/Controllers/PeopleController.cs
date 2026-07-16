using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ControleDeGastos.Api.Dtos;
using ControleDeGastos.Api.Services;
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
                return NotFound(new { Message = "Person not found." });
            }
            
            return Ok(person);
        }

        [HttpPost]
        public async Task<ActionResult<PersonResponseDto>> Create([FromBody] PersonCreateDto dto)
        {
            if (!ModelState.IsValid) 
            {
                return BadRequest(ModelState);
            }

            var createdPerson = await _personService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = createdPerson.Id }, createdPerson);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _personService.DeleteAsync(id);
            if (!deleted) 
            {
                return NotFound(new { Message = "Person not found." });
            }

            return NoContent(); 
        }
    }
}