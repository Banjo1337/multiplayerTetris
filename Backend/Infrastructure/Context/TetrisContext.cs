using System;
using Microsoft.EntityFrameworkCore;
using Core.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Infrastructure.EntityTypeConfigurations;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Data;

public class TetrisContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    // public DbSet<User> Users { get; set; }
    public DbSet<HighScore> HighScores { get; set; }
    public TetrisContext(DbContextOptions<TetrisContext> options) : base(options)
    {
        
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfiguration<HighScore>(new HighScoreEntityTypeConfiguration());
    }

}


