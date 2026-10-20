import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { createAuction } from "../../services/auctionService";

function toInputValue(date: Date): string {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
}

export default function CreateAuctionPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startPrice, setStartPrice] = useState("");
    const [startDate, setStartDate] = useState(() => toInputValue(new Date()));
    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!user) return;

        if (new Date(endDate) <= new Date(startDate)) {
            setError("Slutdatum måste vara efter startdatum.");
            return;
        }

        setError("");
        setSaving(true);
        try {
            const created = await createAuction(
                {
                    title,
                    description,
                    startPrice: Number(startPrice),
                    startDate: new Date(startDate).toISOString(),
                    endDate: new Date(endDate).toISOString(),
                },
                user.token
            );
            navigate(`/auctions/${created.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Kunde inte skapa auktionen");
        } finally {
            setSaving(false);
        }
    }

    return (
        <section className="card form-card form-card--wide">
            <h1>Skapa auktion</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Titel
                    <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={100} />
                </label>
                <label>
                    Beskrivning
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required maxLength={2000} rows={5} />
                </label>
                <label>
                    Utropspris (kr)
                    <input type="number" min={0} step={1} value={startPrice} onChange={(e) => setStartPrice(e.target.value)} required />
                </label>
                <label>
                    Startdatum
                    <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                </label>
                <label>
                    Slutdatum
                    <input type="datetime-local" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} required />
                </label>
                {error && <p role="alert">{error}</p>}
                <button type="submit" disabled={saving}>
                    {saving ? "Skapar..." : "Skapa auktion"}
                </button>
            </form>
        </section>
    );
}