import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getAuction } from "../../services/auctionService";
import { getBids, placeBid } from "../../services/bidService";
import type { Auction } from "../../types/auction";
import type { Bid } from "../../types/bid";
import { formatDate, formatPrice } from "../../utils/format";
import "./AuctionPage.css";

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

    if (loading) return <p className="muted">Laddar...</p>;
    if (error || !auction) return <p role="alert">{error || "Auktionen hittades inte."}</p>;

    const isCreator = user?.userId === auction.creatorId;
    const currentPrice = auction.highestBid ?? auction.startPrice;

    return (
        <section>
            <div className="auction__header">
                <h1>{auction.title}</h1>
                <span className={auction.isOpen ? "badge" : "badge badge--closed"}>
                    {auction.isOpen ? "Öppen" : "Stängd"}
                </span>
            </div>
            <p className="auction__description">{auction.description}</p>

            <div className="auction__layout">
                <div className="card">
                    <h2>Detaljer</h2>
                    <dl className="details">
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
                    </dl>
                </div>

                <div className="card bid-panel">
                    <p className="bid-panel__label muted">
                        {auction.highestBid !== null ? "Högsta bud" : "Utropspris"}
                    </p>
                    <p className="bid-panel__price">{formatPrice(currentPrice)}</p>

                    {!auction.isOpen && <p className="muted">Auktionen är inte öppen för bud.</p>}
                    {auction.isOpen && !user && (
                        <p>
                            <Link to="/login">Logga in</Link> för att lägga bud.
                        </p>
                    )}
                    {auction.isOpen && isCreator && (
                        <p className="muted">Det här är din auktion – du kan inte buda på den.</p>
                    )}
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
                </div>
            </div>

            <div className="card">
                <h2>Bud ({bids.length})</h2>
                {bids.length === 0 ? (
                    <p className="muted">Inga bud än.</p>
                ) : (
                    <ul className="bid-list">
                        {bids.map((bid) => (
                            <li key={bid.id}>
                                <span className="bid-list__amount">{formatPrice(bid.amount)}</span>
                                <span className="muted">
                                    {bid.bidderName} · {formatDate(bid.bidDate)}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}