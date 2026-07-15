using ControleDeGastos.Api.Data; // <--- Importante para enxergar o AppDbContext
using Microsoft.EntityFrameworkCore; // <--- Importante para usar o SQLite

var builder = WebApplication.CreateBuilder(args);

// 1. REGISTRO DE SERVIÇOS NO CONTÊINER (Injeção de Dependência)

// Registra o nosso Banco de Dados SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=controlegastos.db"));

// IMPORTANTE: Adiciona o suporte aos Controllers (já que vamos estruturar o projeto com Controllers e Services)
builder.Services.AddControllers();

// Configurações do Swagger (Documentação da API)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 2. CONFIGURAÇÃO DO PIPELINE DE REQUISIÇÕES HTTP (Middlewares)

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

// IMPORTANTE: Mapeia os endpoints dos nossos Controllers automaticamente
app.MapControllers();

app.Run();