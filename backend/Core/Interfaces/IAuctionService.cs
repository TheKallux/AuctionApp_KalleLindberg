using AuctionApi.Data.DTO;

namespace AuctionApi.Core.Interfaces;

public interface IAuctionService
{
    Task<List<AuctionDto>> SearchAsync(string? title);
    Task<AuctionDto?> GetByIdAsync(int id);
    Task<AuctionDto> CreateAsync(CreateAuctionDto dto, int userId);
}