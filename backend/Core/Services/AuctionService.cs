using AuctionApi.Core.Exceptions;
using AuctionApi.Core.Interfaces;
using AuctionApi.Data.DTO;
using AuctionApi.Data.Entities;
using AuctionApi.Data.Interfaces;
using AutoMapper;

namespace AuctionApi.Core.Services;

public class AuctionService : IAuctionService
{
    private readonly IAuctionRepo _repo;
    private readonly IMapper _mapper;

    public AuctionService(IAuctionRepo repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<List<AuctionDto>> SearchAsync(string? title)
    {
        var auctions = await _repo.SearchOpenAsync(title);
        return _mapper.Map<List<AuctionDto>>(auctions);
    }

    public async Task<AuctionDto?> GetByIdAsync(int id)
    {
        var auction = await _repo.GetByIdAsync(id);
        return auction == null ? null : _mapper.Map<AuctionDto>(auction);
    }

    public async Task<AuctionDto> CreateAsync(CreateAuctionDto dto, int userId)
    {
        var auction = _mapper.Map<Auction>(dto);
        auction.StartDate = dto.StartDate.ToUniversalTime();
        auction.EndDate = dto.EndDate.ToUniversalTime();
        auction.UserId = userId;

        if (auction.EndDate <= auction.StartDate)
            throw new BusinessRuleException("Slutdatum måste vara efter startdatum.");

        if (auction.EndDate <= DateTime.UtcNow)
            throw new BusinessRuleException("Slutdatum måste vara i framtiden.");

        await _repo.AddAsync(auction);

        var created = await _repo.GetByIdAsync(auction.Id);
        return _mapper.Map<AuctionDto>(created!);
    }
}