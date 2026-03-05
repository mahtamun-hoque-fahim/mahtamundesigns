import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, Menu } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { CompaniesEditor } from "@/components/admin/CompaniesEditor";
import { ReviewsEditor } from "@/components/admin/ReviewsEditor";
import { MediaManager } from "@/components/admin/MediaManager";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { ActivityLogViewer } from "@/components/admin/ActivityLogViewer";
import { AdminSettings } from "@/components/admin/AdminSettings";

const PAGE_TITLES: Record<string, string> = {
  overview: "Dashboard Overview",
  pages: "Page Content Manager",
  blocks: "Dynamic Content Blocks",
  media: "Media Library",
  reviews: "Reviews Manager",
  clients: "Clients Manager",
  analytics: "Visitor Analytics",
  activity: "Activity Log",
  settings: "Account & Security",
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/admin/login");
      else setLoading(false);
    });
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      <div className={`transition-all duration-300 ${collapsed ? "ml-16" : "ml-60"}`}>
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-40 flex items-center px-6 gap-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-display text-sm font-bold text-foreground">
            {PAGE_TITLES[activeTab] || "Dashboard"}
          </h1>
        </header>

        <main className="p-6">
          {activeTab === "overview" && <DashboardOverview onNavigate={setActiveTab} />}
          {activeTab === "pages" && <ContentEditor />}
          {activeTab === "blocks" && <ContentBlocksView />}
          {activeTab === "media" && <MediaManager />}
          {activeTab === "reviews" && <ReviewsEditor />}
          {activeTab === "clients" && <CompaniesEditor />}
          {activeTab === "analytics" && <AnalyticsDashboard />}
          {activeTab === "activity" && <ActivityLogViewer />}
          {activeTab === "settings" && <AdminSettings />}
        </main>
      </div>
    </div>
  );
};

/** Content Blocks - combines Companies + Reviews as dynamic blocks */
function ContentBlocksView() {
  const [block, setBlock] = useState<"reviews" | "clients">("reviews");

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {(["reviews", "clients"] as const).map((b) => (
          <button
            key={b}
            onClick={() => setBlock(b)}
            className={`px-4 py-2 rounded-lg text-xs font-display font-semibold uppercase tracking-wider transition-colors ${
              block === b
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {b === "reviews" ? "Review Blocks" : "Client Blocks"}
          </button>
        ))}
      </div>
      {block === "reviews" ? <ReviewsEditor /> : <CompaniesEditor />}
    </div>
  );
}

export default AdminDashboard;
