using AuctionApi.Data.Entities;
using AuctionApi.Data.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AuctionApi.Data.Repos;

public class AuctionRepo : IAuctionRepo
{
    private readonly AuctionDbContext _context;

    public AuctionRepo(AuctionDbContext context)
    {
        _context = context;
    }

    public async Task<List<Auction>> SearchOpenAsync(string? title)
    {
        var now = DateTime.UtcNow;
        var query = _context.Auctions
            .Include(a => a.User)
            .Include(a => a.Bids)
            .Where(a => a.StartDate <= now && a.EndDate > now);

        if (!string.IsNullOrWhiteSpace(title))
            query = query.Where(a => a.Title.Contains(title));

        return await query.OrderBy(a => a.EndDate).ToListAsync();
    }

    public async Task<Auction?> GetByIdAsync(int id)
    {
        return await _context.Auctions
            .Include(a => a.User)
            .Include(a => a.Bids)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task AddAsync(Auction auction)
    {
        _context.Auctions.Add(auction);
        await _context.SaveChangesAsync();
    }
}