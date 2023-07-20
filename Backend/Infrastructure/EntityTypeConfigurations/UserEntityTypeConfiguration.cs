// using Core.Entities;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Metadata.Builders;

// namespace Infrastructure.EntityTypeConfigurations;


// public class UserEntityTypeConfiguration : IEntityTypeConfiguration<HighScore>
// {
//     public void Configure(EntityTypeBuilder<User> config)
//     {
//         config.HasKey(h => h.Id).HasAnnotation;
//         config.Property(h => h.AchievedAt).IsRequired();
//         config.Property(h => h.Score).IsRequired();
//     }
// }