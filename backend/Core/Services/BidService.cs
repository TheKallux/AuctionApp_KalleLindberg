using AuctionApi.Core.Exceptions;
using AuctionApi.Core.Interfaces;
using AuctionApi.Data.DTO;
using AuctionApi.Data.Entities;
using AuctionApi.Data.Interfaces;
using AutoMapper;

namespace AuctionApi.Core.Services;

public class BidService : IBidService
{
    private readonly IBidRepo _bidRepo;
    private readonly IAuctionRepo _auctionRepo;
    private readonly IMapper _mapper;

    public BidService(IBidRepo bidRepo, IAuctionRepo auctionRepo, IMapper mapper)
    {
        _bidRepo = bidRepo;
        _auctionRepo = auctionRepo;
        _mapper = mapper;
    }

    public async Task<List<BidDto>?> GetForAuctionAsync(int auctionId)
    {
        var auction = await _auctionRepo.GetByIdAsync(auctionId);
        if (auction == null)
            return null;

        var bids = await _bidRepo.GetByAuctionIdAsync(auctionId);
        return _mapper.Map<List<BidDto>>(bids);
    }

    public async Task<BidDto?> PlaceBidAsync(int auctionId, decimal amount, int userId)
    {
        var auction = await _auctionRepo.GetByIdAsync(auctionId);
        if (auction == null)
            return null;

        var now = DateTime.UtcNow;

        if (!auction.IsOpenAt(now))
            throw new BusinessRuleException("Auktionen är inte öppen för bud.");

        if (auction.UserId == userId)
            throw new BusinessRuleException("Du kan inte buda på din egen auktion.");

        var currentHighest = auction.Bids.Any() ? auction.Bids.Max(b => b.Amount) : auction.StartPrice;
        if (amount <= currentHighest)
            throw new BusinessRuleException($"Budet är för lågt. Det måste vara högre än {currentHighest} kr.");

        var bid = new Bid { Amount = amount, BidDate = now, AuctionId = auctionId, UserId = userId };
        await _bidRepo.AddAsync(bid);

        return _mapper.Map<BidDto>(bid);
    }
}