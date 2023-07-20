using MediatR;
using Api.Dtos;
using Infrastructure.Data;
using Core.Entities;
using Microsoft.AspNetCore.Identity;

namespace QueryHandlers.HighScoreQueryHandler;

public class AddHighScore
{
    public record Query(HighScoreRequestDto highScoreRequestDto) : IRequest<HighScoreResponseDto>;

    public class Handler : IRequestHandler<Query, HighScoreResponseDto>
    {
        private TetrisContext _context { get; set; }

        public Handler(TetrisContext tetrisContext) => _context = tetrisContext;

        public async Task<HighScoreResponseDto> Handle(Query request, CancellationToken cancellationToken)
        {
            var insertedHighScore = await _context.HighScores.AddAsync(new HighScore()
            {
                UserId = request.highScoreRequestDto.UserId,
                Score = request.highScoreRequestDto.Score,
                AchievedAt = DateTime.UtcNow,
            });

            await _context.SaveChangesAsync();
            

            return new HighScoreResponseDto()
            {
                Id = insertedHighScore.Entity.Id,
                UserId = insertedHighScore.Entity.UserId,
                Score = insertedHighScore.Entity.Score,
                AchievedAt = insertedHighScore.Entity.AchievedAt,
                DisplayName = _context.Users.FirstOrDefault(u => u.Id == request.highScoreRequestDto.UserId)?.DisplayName ?? "n/a"
            };
        }
    }
}