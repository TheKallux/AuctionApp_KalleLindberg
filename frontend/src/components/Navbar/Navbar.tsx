import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <nav>
            <Link to="/">Auktioner</Link>
            {user ? (
                <>
                    <NavLink to="/auctions/new">Skapa auktion</NavLink>
                    <span>Inloggad som {user.name}</span>
                    <button onClick={handleLogout}>Logga ut</button>
                </>
            ) : (
                <>
                    <NavLink to="/login">Logga in</NavLink>
                    <NavLink to="/register">Registrera</NavLink>
                </>
            )}
        </nav>
    );
}