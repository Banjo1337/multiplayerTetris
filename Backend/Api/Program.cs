using Microsoft.EntityFrameworkCore;
using Infrastructure.Data;
using Api;
using Microsoft.AspNetCore.SignalR;
using Api.Chathub;
using Microsoft.Extensions.Caching.Memory;
using Api.HubState;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMediatR(x => x.RegisterServicesFromAssemblies(typeof(Program).Assembly));
builder.Services.AddDbContext<TetrisContext>(opt => opt.UseSqlServer(builder.Configuration.GetConnectionString("dbconnection"), b => b.MigrationsAssembly("Api")));
builder.Services.ConfigureIdentity();
builder.Services.AddHttpContextAccessor();
builder.Services.AddSignalR();
builder.Services.AddSingleton<IGroupReadinessState, GroupReadinessState>();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder => builder.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173", "http://20.119.8.28", "https://20.119.8.28", "https://tetrisalpha.azurewebsites.net", "http://tetrisalpha.azurewebsites.net").AllowAnyHeader().AllowAnyMethod().AllowCredentials());
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapHub<MultiplayerHub>("/multiplayerHub");

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
