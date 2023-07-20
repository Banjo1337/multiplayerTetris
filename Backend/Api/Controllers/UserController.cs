using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Core.Entities;
using Api.Dtos;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using QueryHandlers.HighScoreQueryHandler;
using QueryHandlers.UserQueryHandlers;

namespace api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class UserController : ControllerBase
{
    private readonly IMediator _mediatr;
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;

    public IHttpContextAccessor _accessor { get; }

    public UserController(IMediator mediatr,
    UserManager<User> userManager,
    SignInManager<User> signInManager,
    IHttpContextAccessor accessor
    )
    {
        _mediatr = mediatr;
        _userManager = userManager;
        _signInManager = signInManager;
        _accessor = accessor;
    }

    [HttpGet("", Name = "GetUserData")]
    [Authorize]
    public async Task<IActionResult> GetUserData()
    {
        var user = await _mediatr.Send(new GetUserById.Query(new Guid(_accessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier)!)));
        if (user is not null)
        {
            return Ok(user);
        }

        return NotFound();
    }

    [HttpPost("SignUp")]
    public async Task<IActionResult> SignUp([FromBody] UserSignUpRequestDto userSignUpRequestDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }
        var id = Guid.NewGuid();
        var user = new User()
        {
            Id = id,
            DisplayName = userSignUpRequestDto.DisplayName,
            Email = userSignUpRequestDto.Email,
            UserName = userSignUpRequestDto.Email,
            MemberSince = DateTime.UtcNow
        };
        var result = await _userManager.CreateAsync(user, userSignUpRequestDto.Password);
        await _userManager.AddClaimAsync(user, new Claim(ClaimTypes.Role, "TetrisEnjoyer"));

        if (!result.Succeeded)
        {
            BadRequest(result.Errors);
        }

        var resultSignInResult = await _signInManager.PasswordSignInAsync(userSignUpRequestDto.Email,
            userSignUpRequestDto.Password, true, false);

        if (!resultSignInResult.Succeeded)
        {
            BadRequest();
        }


        return CreatedAtRoute("GetUserData", new UserResponseDto
        {
            Id = user.Id,
            DisplayName = user.DisplayName,
            MemberSince = user.MemberSince,
            HighScores = user.HighScores,
        });
    }

    [HttpPost("SignIn")]
    public async Task<IActionResult> SignIn([FromBody] UserRequestDto userRequestDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _signInManager.PasswordSignInAsync(userRequestDto.Email,
            userRequestDto.Password, true, false);


        if (!result.Succeeded)
        {
            return Unauthorized(result);
        }

        return Accepted();

    }

    [HttpGet("LogOut")]
    public async Task<IActionResult> LogOut()
    {
        var cookieOptions = new CookieOptions
        {
            Path = "/",
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(-1),
            SameSite = SameSiteMode.None,
            Secure = true
        };

        _accessor.HttpContext?.Response.Cookies.Append("Identity.Application", "", cookieOptions);

        return Ok(new { message = "Logout successful." });
    }

}

