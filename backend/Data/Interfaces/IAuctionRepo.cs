using AuctionApi.Data.Entities;

namespace AuctionApi.Data.Interfaces;

public interface IAuctionRepo
{
    Task<List<Auction>> SearchOpenAsync(string? title);
    Task<Auction?> GetByIdAsync(int id);
    Task AddAsync(Auction auction);
}