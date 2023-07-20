using MediatR;
using Api.Dtos;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace QueryHandlers.UserQueryHandlers;

public class GetUserById
{
    public record Query(Guid userId) : IRequest<UserResponseDto>;

    public class Handler : IRequestHandler<Query, UserResponseDto>
    {
        private TetrisContext _context { get; set; }

        public Handler(TetrisContext tetrisContext) => _context = tetrisContext;

        public async Task<UserResponseDto> Handle(Query request, CancellationToken cancellationToken)
        {
            return _context.Users.Include(u => u.HighScores).Where(u => u.Id == request.userId).Select(u => new UserResponseDto()
            {
                Id = u.Id,
                DisplayName = u.DisplayName,
                MemberSince = u.MemberSince,
                // Rename to top5 highscores
                HighScores = u.HighScores.OrderByDescending(h => h.Score).Take(5).ToList(),
            }).FirstOrDefault()!;
        }
    }
}