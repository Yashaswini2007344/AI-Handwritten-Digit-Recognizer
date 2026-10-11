import {
  LayoutDashboard,
  Hash,
  History as HistoryIcon,
  BarChart3,
  UserRound,
  Settings,
  MessageSquare,
  Brain,
} from "lucide-react";

const items = [
  ["dashboard", "Dashboard", LayoutDashboard],
  ["digit", "Digit Recognition", Hash],
  ["multi_digit", "Multi-Digit Recognition", Hash],
  ["automatic_number_extraction", "Automatic Number Extraction", Hash],
  ["history", "History", HistoryIcon],
  ["analytics", "Analytics", BarChart3],
  ["profile", "Profile", UserRound],
  ["settings", "Settings", Settings],
  ["feedback", "Feedback", MessageSquare],
];

export default function Sidebar({
  activePage,
  setActivePage,
  open,
}) {
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>

      {/* BRAND / LOGO */}
      <div
        className="brand"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          width: "100%",
          padding: "20px 16px",
          marginBottom: "24px",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <div
          className="brand-icon"
          style={{
            width: "42px",
            height: "42px",
            minWidth: "42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Brain size={23} />
        </div>

        <div>
          <b>AI Handwriting</b>
          <small style={{ display: "block" }}>
            Recognition Studio
          </small>
        </div>
      </div>

      {/* MENU */}
      <div
        className="sidebar-menu-scroll"
        style={{
          display: "block",
          width: "100%",
          flex: 1,
          minHeight: 0,
          marginTop: 0,
          padding: "0 12px",
          boxSizing: "border-box",
        }}
      >
        <nav
          className="sidebar-nav"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: "8px",
            width: "100%",
          }}
        >
          {items.map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              className={activePage === id ? "active" : ""}
              onClick={() => setActivePage(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                minHeight: "44px",
                margin: 0,
                boxSizing: "border-box",
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* AI ENGINE */}
      <div className="engine">
        <span className="status-dot green"></span>

        <div>
          AI Engine
          <div>Digit AI Ready</div>
        </div>
      </div>

    </aside>
  );
}