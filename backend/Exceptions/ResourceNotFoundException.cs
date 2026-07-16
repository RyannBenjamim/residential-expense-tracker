using System;

namespace ControleDeGastos.Api.Exceptions
{
    /// <summary>
    /// Exceção lançada quando um recurso obrigatório não é encontrado durante uma operação.
    /// </summary>
    public class ResourceNotFoundException : Exception
    {
        public ResourceNotFoundException(string message) : base(message) { }
    }
}