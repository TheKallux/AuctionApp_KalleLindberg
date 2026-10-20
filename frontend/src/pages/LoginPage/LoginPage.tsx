import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as authService from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const user = await authService.login({ email, password });
            login(user);
            navigate("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Något gick fel");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="card form-card">
            <h1>Logga in</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    E-post
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    Lösenord
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                {error && <p role="alert">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Loggar in..." : "Logga in"}
                </button>
            </form>
            <p>
                Inget konto? <Link to="/register">Registrera dig</Link>
            </p>
        </section>
    );
}