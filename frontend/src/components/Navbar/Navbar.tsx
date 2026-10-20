import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Navbar.css";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <nav className="navbar">
            <div className="navbar__inner">
                <Link to="/" className="navbar__brand">
                    Auktioner
                </Link>
                {user ? (
                    <>
                        <NavLink to="/auctions/new" className="navbar__link">
                            Skapa auktion
                        </NavLink>
                        <span className="navbar__user">Inloggad som {user.name}</span>
                        <button className="navbar__logout" onClick={handleLogout}>
                            Logga ut
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login" className="navbar__link">
                            Logga in
                        </NavLink>
                        <NavLink to="/register" className="navbar__link">
                            Registrera
                        </NavLink>
                    </>
                )}
            </div>
        </nav>
    );
}