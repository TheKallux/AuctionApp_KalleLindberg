using AuctionApi.Core.Exceptions;
using AuctionApi.Core.Interfaces;
using AuctionApi.Data.DTO;
using AuctionApi.Data.Entities;
using AuctionApi.Data.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace AuctionApi.Core.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepo _repo;
    private readonly IPasswordHasher<User> _hasher;

    public AuthService(IUserRepo repo,
    IPasswordHasher<User> hasher)
    {
        _repo = repo;
        _hasher = hasher;
    }

    public async Task RegisterAsync(RegisterDto dto)
    {
        if (await _repo.EmailExistsAsync(dto.Email))
            throw new BusinessRuleException("E-postadressen används redan.");

        if (await _repo.NameExistsAsync(dto.Name))
            throw new BusinessRuleException("Användarnamnet är upptaget.");

        var user = new User { Name = dto.Name, Email = dto.Email };
        user.PasswordHash = _hasher.HashPassword(user, dto.Password);
        await _repo.AddAsync(user);
    }

}