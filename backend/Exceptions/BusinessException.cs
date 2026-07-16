using System;

namespace ControleDeGastos.Api.Exceptions
{
    /// <summary>
    /// Exceção lançada quando uma regra de negócio do sistema é violada.
    /// </summary>
    public class BusinessException : Exception
    {
        public BusinessException(string message) : base(message) { }
    }
}