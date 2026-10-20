import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { searchAuctions } from "../../services/auctionService";
import type { Auction } from "../../types/auction";
import { formatDate, formatPrice } from "../../utils/format";
import "./HomePage.css";

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

            <form onSubmit={handleSearch} role="search" className="search">
                <input
                    type="search"
                    placeholder="Sök på titel..."
                    aria-label="Sök på titel"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit">Sök</button>
            </form>

            {loading && <p className="muted">Laddar...</p>}
            {error && <p role="alert">{error}</p>}
            {!loading && !error && auctions.length === 0 && (
                <p className="muted">Inga öppna auktioner hittades.</p>
            )}

            <ul className="auction-grid">
                {auctions.map((auction) => (
                    <li key={auction.id}>
                        <Link to={`/auctions/${auction.id}`} className="card auction-card">
                            <h2 className="auction-card__title">{auction.title}</h2>
                            <p className="auction-card__description muted">{auction.description}</p>
                            <p className="auction-card__label muted">
                                {auction.highestBid !== null ? "Högsta bud" : "Utropspris"}
                            </p>
                            <p className="auction-card__price">
                                {formatPrice(auction.highestBid ?? auction.startPrice)}
                            </p>
                            <p className="auction-card__end muted">Slutar {formatDate(auction.endDate)}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}