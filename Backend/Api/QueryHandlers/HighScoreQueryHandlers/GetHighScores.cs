using MediatR;
using Api.Dtos;
using Infrastructure.Data;

namespace QueryHandlers.HighScoreQueryHandler;

public class GetHighScores
{
    public record Query() : IRequest<IEnumerable<HighScoreResponseDto>>;

    public class Handler : IRequestHandler<Query, IEnumerable<HighScoreResponseDto>>
    {
        private TetrisContext _context { get; set; }

        public Handler(TetrisContext tetrisContext) => _context = tetrisContext;

        public async Task<IEnumerable<HighScoreResponseDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            return _context.HighScores.Select(h => new HighScoreResponseDto()
            {
                Id = h.Id,
                UserId = h.UserId,
                Score = h.Score,
                AchievedAt = h.AchievedAt,
                DisplayName = h.User.DisplayName
            }).OrderByDescending(h => h.Score);
        }
    }
}