using AuctionApi.Data.DTO;

namespace AuctionApi.Core.Interfaces;

public interface IBidService
{
    Task<List<BidDto>?> GetForAuctionAsync(int auctionId);
    Task<BidDto?> PlaceBidAsync(int auctionId, decimal amount, int userId);
}