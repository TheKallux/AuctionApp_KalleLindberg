using System.ComponentModel.DataAnnotations;

namespace AuctionApi.Data.DTO;

public class CreateBidDto
{
    [Range(0.01, 100000000)]
    public decimal Amount { get; set; }
}