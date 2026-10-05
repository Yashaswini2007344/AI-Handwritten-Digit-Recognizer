import {
  LayoutDashboard,
  Hash,
  Type,
  AlignLeft,
  FileText,
  History as HistoryIcon,
  BarChart3,
  UserRound,
  Settings,
  MessageSquare,
  Brain,
  Camera,
  Volume2,
  Languages,
  BookOpen,
  Cloud,
  Bot,
  Search,
  ShieldCheck,
} from "lucide-react";

const items = [
  // MAIN
  ["dashboard", "Dashboard", LayoutDashboard],

  // RECOGNITION
  ["digit", "Digit Recognition", Hash],
  ["character", "Character Recognition", Type],
  ["word", "Word Recognition", AlignLeft],
  ["text", "Text Recognition", FileText],

  // ADVANCED CAPABILITIES
  ["camera", "Camera Recognition", Camera],
  ["speech", "Handwriting to Speech", Volume2],
  ["multilingual", "Marathi + Hindi + English", Languages],
  ["notebook", "Notebook Digitization", BookOpen],
  ["cloud", "Cloud Processing", Cloud],
  ["assistant", "AI Document Assistant", Bot],
  ["search-documents", "Search Handwritten Documents", Search],
  ["privacy-ai", "Privacy-Preserving AI", ShieldCheck],

  // USER & DATA
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

      {/* BRAND */}
      <div className="brand">
        <div className="brand-icon">
          <Brain size={20} />
        </div>

        <div>
          <b>AI Handwriting</b>
          <small>Recognition Studio</small>
        </div>
      </div>

      {/* SCROLLABLE MENU */}
      <div className="sidebar-menu-scroll">

        <nav className="sidebar-nav">

          {items.map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              className={
                activePage === id
                  ? "active"
                  : ""
              }
              onClick={() => {
                setActivePage(id);
              }}
            >
              <Icon size={18} />

              <span>
                {label}
              </span>
            </button>
          ))}

        </nav>

      </div>

      {/* AI ENGINE */}
      <div className="engine">

        <span className="status-dot green"></span>

        <div>
          AI Engine

          <div>
            Frontend Ready
          </div>
        </div>

      </div>

    </aside>
  );
}