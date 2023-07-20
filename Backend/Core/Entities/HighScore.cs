using System;

namespace Core.Entities;

public class HighScore : BaseEntity
{
    public Guid UserId { get; set; }
    public int Score { get; set; }
    public DateTime AchievedAt { get; set; }
    public User User { get; set; } = default!;
}
