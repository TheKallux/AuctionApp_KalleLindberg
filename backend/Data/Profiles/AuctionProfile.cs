using AuctionApi.Data.DTO;
using AuctionApi.Data.Entities;
using AutoMapper;

namespace AuctionApi.Data.Profiles;

public class AuctionProfile : Profile
{
    public AuctionProfile()
    {
        CreateMap<CreateAuctionDto, Auction>();

        CreateMap<Auction, AuctionDto>()
            .ForMember(d => d.CreatorId, o => o.MapFrom(s => s.UserId))
            .ForMember(d => d.CreatorName, o => o.MapFrom(s => s.User.Name))
            .ForMember(d => d.HighestBid, o => o.MapFrom(s =>
                s.Bids.Any() ? s.Bids.Max(b => b.Amount) : (decimal?)null))
            .ForMember(d => d.IsOpen, o => o.MapFrom(s => s.IsOpenAt(DateTime.UtcNow)));
    }
}