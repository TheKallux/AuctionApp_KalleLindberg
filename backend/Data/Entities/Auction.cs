namespace AuctionApi.Data.Entities;

public class Auction
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal StartPrice { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public List<Bid> Bids { get; set; } = new();

}

