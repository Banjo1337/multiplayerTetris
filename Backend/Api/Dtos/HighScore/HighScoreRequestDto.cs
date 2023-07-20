namespace Api.Dtos;
public class HighScoreRequestDto
{
    public Guid UserId { get; set; }
    public int Score { get; set; }

}