using AuctionApi.Data.Entities;
using AuctionApi.Data.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AuctionApi.Data.Repos;

public class BidRepo : IBidRepo
{
    private readonly AuctionDbContext _context;

    public BidRepo(AuctionDbContext context)
    {
        _context = context;
    }

    public async Task<List<Bid>> GetByAuctionIdAsync(int auctionId)
    {
        return await _context.Bids
            .Include(b => b.User)
            .Where(b => b.AuctionId == auctionId)
            .OrderByDescending(b => b.Amount)
            .ToListAsync();
    }

    public async Task AddAsync(Bid bid)
    {
        _context.Bids.Add(bid);
        await _context.SaveChangesAsync();
        await _context.Entry(bid).Reference(b => b.User).LoadAsync();
    }
}