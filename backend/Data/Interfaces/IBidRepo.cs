using AuctionApi.Data.Entities;

namespace AuctionApi.Data.Interfaces;

public interface IBidRepo
{
    Task<List<Bid>> GetByAuctionIdAsync(int auctionId);
    Task AddAsync(Bid bid);
}