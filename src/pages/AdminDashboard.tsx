import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, RefreshCw, FileText, Building2, MessageSquare, Image } from "lucide-react";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { CompaniesEditor } from "@/components/admin/CompaniesEditor";
import { ReviewsEditor } from "@/components/admin/ReviewsEditor";
import { MediaManager } from "@/components/admin/MediaManager";

const tabs = [
  { id: "content", label: "Content", icon: FileText },
  { id: "companies", label: "Companies", icon: Building2 },
  { id: "reviews", label: "Reviews", icon: MessageSquare },
  { id: "media", label: "Media", icon: Image },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("content");
  const [loading, setLoading] = useState(true);
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

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><RefreshCw className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="font-display text-lg font-bold text-foreground">
            CMS <span className="text-primary">Dashboard</span>
          </h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-display font-semibold uppercase tracking-wider transition-colors ${activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "content" && <ContentEditor />}
        {activeTab === "companies" && <CompaniesEditor />}
        {activeTab === "reviews" && <ReviewsEditor />}
        {activeTab === "media" && <MediaManager />}
      </main>
    </div>
  );
};

export default AdminDashboard;
