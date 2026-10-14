using AuctionApi.Core.Exceptions;
using AuctionApi.Core.Interfaces;
using AuctionApi.Data.DTO;
using Microsoft.AspNetCore.Mvc;

namespace AuctionApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _service;

    public AuthController(IAuthService service)
    {
        _service = service;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        try
        {
            await _service.RegisterAsync(dto);
            return StatusCode(201);
        }
        catch (BusinessRuleException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var result = await _service.LoginAsync(dto);
        if (result == null)
            return Unauthorized(new { message = "Fel e-post eller lösenord." });

        return Ok(result);
    }
}