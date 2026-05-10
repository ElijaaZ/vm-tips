const Navbar = ({ activeTab, setActiveTab, hasSubmitted }) => {
  const tabs = hasSubmitted
    ? ["Mitt Spel", "Ställning", "Regler"]
    : ["Speltipset", "Regler"];
  return (
    <nav className="navbar">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={activeTab === tab ? "nav-link active" : "nav-link"}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
};

export default Navbar;
