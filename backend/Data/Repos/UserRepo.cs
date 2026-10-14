using AuctionApi.Data.Entities;
using AuctionApi.Data.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AuctionApi.Data.Repos;

public class UserRepo : IUserRepo
{
    private readonly AuctionDbContext _context;
    public UserRepo(AuctionDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u =>
        u.Email == email);
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _context.Users.AnyAsync(u =>
        u.Email == email);
    }

    public async Task<bool> NameExistsAsync(string name)
    {
        return await _context.Users.AnyAsync(u =>
        u.Name == name);
    }

    public async Task AddAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
    }
}