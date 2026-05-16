import "../../index.css";

const AppHeader = ({ handleLogout, user }) => {
  console.log("AppHeader user:", user);
  return (
    <div className="header">
      <div className="header-titles">
        <h1 className="vmTitle">VM 2026</h1>
        <h3 className="vmSubtitle">SPELTIPSET</h3>
      </div>

      <div className="header-user">
        <span className="username">
          {user?.user_metadata?.firstName && user?.user_metadata?.lastName
            ? `${user.user_metadata.firstName} ${user.user_metadata.lastName}`
            : user?.email}
        </span>
        <button
          onClick={handleLogout}
          className="logout-btn"
          aria-label="Logga ut"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="white"
            viewBox="0 0 24 24"
          >
            <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zM20 3h-8v2h8v14h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AppHeader;
