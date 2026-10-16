namespace AuctionApi.Data.DTO;

public class BidDto
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public DateTime BidDate { get; set; }
    public int BidderId { get; set; }
    public string BidderName { get; set; } = string.Empty;
}