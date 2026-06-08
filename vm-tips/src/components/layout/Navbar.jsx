import { useNavigate, useLocation } from "react-router-dom";
import "../../index.css";

const Navbar = ({ user, adminEmail }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav className="navbar">
      <button
        className={`nav-link ${isActive("/")}`}
        onClick={() => navigate("/")}
      >
        Speltipset
      </button>
      <button
        className={`nav-link ${isActive("/matchcenter")}`}
        onClick={() => navigate("/matchcenter")}
      >
        Matchcenter
      </button>
      <button
        className={`nav-link ${isActive("/poangtabell")}`}
        onClick={() => navigate("/poangtabell")}
      >
        Poängtabell
      </button>
      <button
        className={`nav-link ${isActive("/regler")}`}
        onClick={() => navigate("/regler")}
      >
        Regler
      </button>
      {user?.email === adminEmail && (
        <button
          className={`nav-link ${isActive("/admin")}`}
          onClick={() => navigate("/admin")}
        >
          Admin
        </button>
      )}
    </nav>
  );
};

export default Navbar;
