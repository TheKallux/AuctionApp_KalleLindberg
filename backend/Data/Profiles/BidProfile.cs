using AuctionApi.Data.DTO;
using AuctionApi.Data.Entities;
using AutoMapper;

namespace AuctionApi.Data.Profiles;

public class BidProfile : Profile
{
    public BidProfile()
    {
        CreateMap<Bid, BidDto>()
            .ForMember(d => d.BidderId, o => o.MapFrom(s => s.UserId))
            .ForMember(d => d.BidderName, o => o.MapFrom(s => s.User.Name));
    }
}