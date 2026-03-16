'use client'
import {
  LayoutDashboard,
  FileText,
  Layers,
  Image,
  MessageSquare,
  Building2,
  BarChart3,
  ClipboardList,
  Settings,
  LogOut,
  FolderOpen,
  Inbox,
} from "lucide-react";

const navItems = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "messages", label: "Messages", icon: Inbox },
  { id: "pages", label: "Pages", icon: FileText },
  { id: "blocks", label: "Content Blocks", icon: Layers },
  { id: "media", label: "Media Library", icon: Image },
  { id: "logo-strip", label: "Logo Strip", icon: Image },
  { id: "media-store", label: "Media Store", icon: FolderOpen },
  { id: "reviews", label: "Reviews", icon: MessageSquare },
  { id: "clients", label: "Clients", icon: Building2 },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "activity", label: "Activity Log", icon: ClipboardList },
  { id: "settings", label: "Settings", icon: Settings },
];

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function AdminSidebar({ activeTab, onTabChange, onLogout, collapsed }: AdminSidebarProps) {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-sidebar-background border-r border-sidebar-border z-50 flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-primary-foreground font-bold text-sm">M</span>
        </div>
        {!collapsed && (
          <span className="ml-3 font-display font-bold text-sidebar-foreground text-sm truncate">
            Dashboard
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto space-y-1 px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-sidebar-border">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-colors"
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
