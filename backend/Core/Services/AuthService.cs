using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AuctionApi.Core.Exceptions;
using AuctionApi.Core.Interfaces;
using AuctionApi.Data.DTO;
using AuctionApi.Data.Entities;
using AuctionApi.Data.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace AuctionApi.Core.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepo _repo;
    private readonly IPasswordHasher<User> _hasher;
    private readonly IConfiguration _config;

    public AuthService(IUserRepo repo, IPasswordHasher<User> hasher, IConfiguration config)
    {
        _repo = repo;
        _hasher = hasher;
        _config = config;
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

    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await _repo.GetByEmailAsync(dto.Email);
        if (user == null)
            return null;

        var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
        if (result == PasswordVerificationResult.Failed)
            return null;

        return new AuthResponseDto { Token = CreateToken(user), UserId = user.Id, Name = user.Name };
    }

    private string CreateToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Name)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}