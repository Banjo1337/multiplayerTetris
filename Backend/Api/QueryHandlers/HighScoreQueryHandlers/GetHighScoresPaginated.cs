using MediatR;
using Api.Dtos;
using Infrastructure.Data;

namespace QueryHandlers.HighScoreQueryHandler;

public class GetHighScoresPaginated
{
    public record Query(int page, string? displayName) : IRequest<IEnumerable<HighScoreResponseDto>>;

    public class Handler : IRequestHandler<Query, IEnumerable<HighScoreResponseDto>>
    {
        private TetrisContext _context { get; set; }

        private const int pageSize = 20;

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
            }).Where(h => request.displayName != null ? h.DisplayName == request.displayName : true).OrderByDescending(h => h.Score).Skip(request.page * pageSize).Take(pageSize);
        }
    }
}