using System.Security.Claims;
using AuctionApi.Core.Exceptions;
using AuctionApi.Core.Interfaces;
using AuctionApi.Data.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuctionApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuctionsController : ControllerBase
{
    private readonly IAuctionService _service;

    public AuctionsController(IAuctionService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] string? title)
    {
        var auctions = await _service.SearchAsync(title);
        return Ok(auctions);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var auction = await _service.GetByIdAsync(id);
        if (auction == null)
            return NotFound();

        return Ok(auction);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(CreateAuctionDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        try
        {
            var created = await _service.CreateAsync(dto, userId);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (BusinessRuleException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}