using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Core.Entities;
public class User : IdentityUser<Guid>
{
    public required string DisplayName { get; set; }
    public DateTime MemberSince { get; set; }
    public List<HighScore> HighScores { get; set; } = new();
}


