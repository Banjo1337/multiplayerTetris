// using Core.Entities;

using Core.Entities;

namespace Api.Dtos;

public class UserResponseDto : BaseEntity
{
    public string DisplayName { get; set; } = "";
    public DateTime MemberSince { get; set; }
    public List<HighScore> HighScores { get; set; } = new();
}