import "../../src/index.css";

const AppHeader = ({ handleLogout }) => {
  return (
    <div className="header">
      <h1 className="vmTitle">VM 2026</h1>
      <h3 className="vmSubtitle">SPELTIPSET</h3>
      <button onClick={handleLogout} className="logout-btn">
        Logga ut
      </button>
    </div>
  );
};

export default AppHeader;
