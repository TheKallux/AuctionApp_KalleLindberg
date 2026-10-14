using AuctionApi.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuctionApi.Data;

public class AuctionDbContext : DbContext
{
    public AuctionDbContext(DbContextOptions<AuctionDbContext> options) : base(options)
    {

    }

    public DbSet<User> Users { get; set; }
    public DbSet<Auction> Auctions { get; set; }
    public DbSet<Bid> Bids { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().Property(u => u.Email).HasMaxLength(256);
        modelBuilder.Entity<User>().Property(u => u.Name).HasMaxLength(50);
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => u.Name).IsUnique();

        modelBuilder.Entity<Auction>().Property(a => a.StartPrice).HasPrecision(18, 2);
        modelBuilder.Entity<Bid>().Property(b => b.Amount).HasPrecision(18, 2);

        modelBuilder.Entity<Bid>()
            .HasOne(b => b.User)
            .WithMany(u => u.Bids)
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.Restrict);

    }
}
