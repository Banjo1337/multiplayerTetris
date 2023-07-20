namespace Api.Dtos;

public class HighScoreResponseDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public int Score { get; set; }
    public DateTime AchievedAt { get; set; }
    public required string DisplayName { get; set; }
}