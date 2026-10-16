using AuctionApi.Data.Entities;

namespace AuctionApi.Data.Interfaces;

public interface IUserRepo
{
    Task<User?> GetByEmailAsync(string email);
    Task<bool> EmailExistsAsync(string email);
    Task<bool> NameExistsAsync(string name);
    Task AddAsync(User user);
}