using System.Net;
using System.Text.Json;
using ControleDeGastos.Api.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace ControleDeGastos.Api.Middlewares
{
    /// <summary>
    /// Middleware responsável por capturar exceções não tratadas da aplicação
    /// e retornar respostas HTTP padronizadas utilizando ProblemDetails.
    /// </summary>
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        /// <summary>
        /// Executa o próximo middleware da aplicação e intercepta possíveis exceções.
        /// </summary>
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        /// <summary>
        /// Converte exceções da aplicação em respostas HTTP adequadas.
        /// </summary>
        private static Task HandleExceptionAsync(
            HttpContext context,
            Exception exception)
        {
            context.Response.ContentType = "application/problem+json";

            var problemDetails = new ProblemDetails();

            switch (exception)
            {
                // Recurso solicitado não foi encontrado no sistema.
                case ResourceNotFoundException:
                    context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                    problemDetails.Status = context.Response.StatusCode;
                    problemDetails.Title = "Referenced Resource Not Found";
                    problemDetails.Detail = exception.Message;
                    break;

                // Erros relacionados às regras de negócio da aplicação.
                case BusinessException:
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    problemDetails.Status = context.Response.StatusCode;
                    problemDetails.Title = "Business Rule Violation";
                    problemDetails.Detail = exception.Message;
                    break;

                // Evita expor detalhes internos da aplicação para o cliente.
                default:
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    problemDetails.Status = context.Response.StatusCode;
                    problemDetails.Title = "Internal Server Error";
                    problemDetails.Detail = "An unexpected error occurred. Please try again later.";
                    break;
            }

            var result = JsonSerializer.Serialize(problemDetails);

            return context.Response.WriteAsync(result);
        }
    }
}