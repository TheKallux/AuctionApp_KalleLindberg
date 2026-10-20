import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getAuction } from "../../services/auctionService";
import { getBids, placeBid } from "../../services/bidService";
import type { Auction } from "../../types/auction";
import type { Bid } from "../../types/bid";
import { formatDate, formatPrice } from "../../utils/format";

export default function AuctionPage() {
    const { id } = useParams();
    const auctionId = Number(id);
    const { user } = useAuth();

    const [auction, setAuction] = useState<Auction | null>(null);
    const [bids, setBids] = useState<Bid[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [reloadKey, setReloadKey] = useState(0);

    const [amount, setAmount] = useState("");
    const [bidError, setBidError] = useState("");
    const [bidding, setBidding] = useState(false);

    useEffect(() => {
        let ignore = false;

        Promise.all([getAuction(auctionId), getBids(auctionId)])
            .then(([auctionData, bidData]) => {
                if (ignore) return;
                setAuction(auctionData);
                setBids(bidData);
            })
            .catch((err) => {
                if (!ignore) setError(err instanceof Error ? err.message : "Kunde inte hämta auktionen");
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, [auctionId, reloadKey]);

    async function handleBid(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!user) return;

        setBidError("");
        setBidding(true);
        try {
            await placeBid(auctionId, Number(amount), user.token);
            setAmount("");
            setReloadKey((key) => key + 1);
        } catch (err) {
            setBidError(err instanceof Error ? err.message : "Kunde inte lägga bud");
        } finally {
            setBidding(false);
        }
    }

    if (loading) return <p>Laddar...</p>;
    if (error || !auction) return <p role="alert">{error || "Auktionen hittades inte."}</p>;

    const isCreator = user?.userId === auction.creatorId;
    const currentPrice = auction.highestBid ?? auction.startPrice;

    return (
        <section>
            <h1>{auction.title}</h1>
            <p>{auction.description}</p>

            <dl>
                <dt>Skapad av</dt>
                <dd>{auction.creatorName}</dd>
                <dt>Utropspris</dt>
                <dd>{formatPrice(auction.startPrice)}</dd>
                <dt>Högsta bud</dt>
                <dd>{auction.highestBid !== null ? formatPrice(auction.highestBid) : "Inga bud än"}</dd>
                <dt>Startar</dt>
                <dd>{formatDate(auction.startDate)}</dd>
                <dt>Slutar</dt>
                <dd>{formatDate(auction.endDate)}</dd>
                <dt>Status</dt>
                <dd>{auction.isOpen ? "Öppen" : "Stängd"}</dd>
            </dl>

            <h2>Lägg bud</h2>
            {!auction.isOpen && <p>Auktionen är inte öppen för bud.</p>}
            {auction.isOpen && !user && (
                <p>
                    <Link to="/login">Logga in</Link> för att lägga bud.
                </p>
            )}
            {auction.isOpen && isCreator && <p>Det här är din auktion – du kan inte buda på den.</p>}
            {auction.isOpen && user && !isCreator && (
                <form onSubmit={handleBid}>
                    <label>
                        Ditt bud (mer än {formatPrice(currentPrice)})
                        <input
                            type="number"
                            min={1}
                            step={1}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </label>
                    {bidError && <p role="alert">{bidError}</p>}
                    <button type="submit" disabled={bidding}>
                        {bidding ? "Lägger bud..." : "Lägg bud"}
                    </button>
                </form>
            )}

            <h2>Bud ({bids.length})</h2>
            {bids.length === 0 ? (
                <p>Inga bud än.</p>
            ) : (
                <ul>
                    {bids.map((bid) => (
                        <li key={bid.id}>
                            {formatPrice(bid.amount)} – {bid.bidderName} – {formatDate(bid.bidDate)}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}