using Microsoft.AspNetCore.Mvc;
using MediatR;
using QueryHandlers.HighScoreQueryHandler;
using Api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Core.Entities;
using System.Security.Claims;

namespace api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class HighScoreController : ControllerBase
{
    private readonly IMediator _mediatr;
    private readonly UserManager<User> _userManager;
    public IHttpContextAccessor _accessor { get; }

    public HighScoreController(IMediator mediatr, IHttpContextAccessor accessor, UserManager<User> userManager)
    {
        _mediatr = mediatr;
        _accessor = accessor;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _mediatr.Send(new GetHighScores.Query()));
    }

    [HttpGet("UserHighScores")]
    public async Task<IActionResult> GetUserHighScores()
    {
        var user = await _userManager.FindByIdAsync(_accessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return Ok(await _mediatr.Send(new GetHighScoresByUserId.Query(user.Id)));
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] HighScoreRequestDto highScoreRequestDto)
    {
        return Ok(await _mediatr.Send(new AddHighScore.Query(highScoreRequestDto)));
    }

    [Authorize]
    [HttpPost("UserHighScore/{score:int}")]
    public async Task<IActionResult> PostUserHighScore(int score)
    {
        var user = await _userManager.FindByIdAsync(_accessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        if (user is null)
        {
            return Unauthorized();
        }

        return Ok(await _mediatr.Send(new AddHighScore.Query(new HighScoreRequestDto
        {
            Score = score,
            UserId = user.Id
        })));
    }

    [HttpGet("GetPaginated/{page:int}")]
    public async Task<IActionResult> GetPaginatedHighscore(int page, string? displayName)
    {
        return Ok(await _mediatr.Send(new GetHighScoresPaginated.Query(page, displayName)));
    }
}
