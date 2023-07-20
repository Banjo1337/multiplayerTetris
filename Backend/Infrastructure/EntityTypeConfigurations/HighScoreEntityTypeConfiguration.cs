using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.EntityTypeConfigurations;


public class HighScoreEntityTypeConfiguration : IEntityTypeConfiguration<HighScore>
{
    public void Configure(EntityTypeBuilder<HighScore> config)
    {
        config.HasOne<User>(h => h.User).WithMany(u => u.HighScores).HasForeignKey(h => h.UserId);
        config.HasKey(h => h.Id);
        config.Property(h => h.AchievedAt).IsRequired();
        config.Property(h => h.Score).IsRequired();
    }
}