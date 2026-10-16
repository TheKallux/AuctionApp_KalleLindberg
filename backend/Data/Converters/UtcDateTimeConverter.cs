using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace AuctionApi.Data.Converters;

public class UtcDateTimeConverter : ValueConverter<DateTime, DateTime>
{
    public UtcDateTimeConverter() : base(
        toDb => toDb.ToUniversalTime(),
        fromDb => DateTime.SpecifyKind(fromDb, DateTimeKind.Utc))
    {
    }
}