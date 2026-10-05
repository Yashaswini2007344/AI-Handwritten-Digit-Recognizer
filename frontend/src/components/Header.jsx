import { Menu, Search, Bell } from "lucide-react";

export default function Header({
  setSidebarOpen,
  setActivePage,
}) {
  return (
    <header className="header">
      <button
        type="button"
        className="icon-btn mobile-only"
        onClick={() => setSidebarOpen((value) => !value)}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div className="top-search">
        <Search size={17} />

        <input
          type="text"
          placeholder="Search dashboard..."
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              setActivePage("history");
            }
          }}
        />
      </div>

      <div className="header-right">
        <button
          type="button"
          className="icon-btn"
          onClick={() => alert("No new notifications")}
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>

        <button
          type="button"
          className="profile-mini"
          onClick={() => setActivePage("profile")}
          aria-label="Open profile"
        >
          <span>A</span>

          <div>
            <b>Ankita</b>
            <small>Student</small>
          </div>
        </button>
      </div>
    </header>
  );
}