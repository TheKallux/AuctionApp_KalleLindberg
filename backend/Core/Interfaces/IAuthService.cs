using AuctionApi.Data.DTO;

namespace AuctionApi.Core.Interfaces;

public interface IAuthService
{
    Task RegisterAsync(RegisterDto dto);
}