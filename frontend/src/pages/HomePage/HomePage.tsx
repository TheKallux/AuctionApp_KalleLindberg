import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { searchAuctions } from "../../services/auctionService";
import type { Auction } from "../../types/auction";
import { formatDate, formatPrice } from "../../utils/format";

export default function HomePage() {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [search, setSearch] = useState("");
    const [query, setQuery] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;

        searchAuctions(query)
            .then((data) => {
                if (!ignore) setAuctions(data);
            })
            .catch((err) => {
                if (!ignore) setError(err instanceof Error ? err.message : "Kunde inte hämta auktioner");
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, [query]);

    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError("");
        setQuery(search.trim());
    }

    return (
        <section>
            <h1>Öppna auktioner</h1>

            <form onSubmit={handleSearch} role="search">
                <input
                    type="search"
                    placeholder="Sök på titel..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit">Sök</button>
            </form>

            {loading && <p>Laddar...</p>}
            {error && <p role="alert">{error}</p>}
            {!loading && !error && auctions.length === 0 && <p>Inga öppna auktioner hittades.</p>}

            <ul>
                {auctions.map((auction) => (
                    <li key={auction.id}>
                        <Link to={`/auctions/${auction.id}`}>
                            <h2>{auction.title}</h2>
                        </Link>
                        <p>
                            {auction.highestBid !== null
                                ? `Högsta bud: ${formatPrice(auction.highestBid)}`
                                : `Utropspris: ${formatPrice(auction.startPrice)}`}
                        </p>
                        <p>Slutar: {formatDate(auction.endDate)}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}