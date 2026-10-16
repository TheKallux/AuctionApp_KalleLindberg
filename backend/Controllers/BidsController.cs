using System.Security.Claims;
using AuctionApi.Core.Exceptions;
using AuctionApi.Core.Interfaces;
using AuctionApi.Data.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuctionApi.Controllers;

[Route("api/auctions/{auctionId:int}/bids")]
[ApiController]
public class BidsController : ControllerBase
{
    private readonly IBidService _service;

    public BidsController(IBidService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetForAuction(int auctionId)
    {
        var bids = await _service.GetForAuctionAsync(auctionId);
        if (bids == null)
            return NotFound();

        return Ok(bids);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> PlaceBid(int auctionId, CreateBidDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        try
        {
            var bid = await _service.PlaceBidAsync(auctionId, dto.Amount, userId);
            if (bid == null)
                return NotFound();

            return StatusCode(201, bid);
        }
        catch (BusinessRuleException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}