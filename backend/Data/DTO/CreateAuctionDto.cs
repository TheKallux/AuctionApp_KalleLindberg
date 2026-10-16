using System.ComponentModel.DataAnnotations;

namespace AuctionApi.Data.DTO;

public class CreateAuctionDto
{
    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Range(0, 1000000)]
    public decimal StartPrice { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }
}