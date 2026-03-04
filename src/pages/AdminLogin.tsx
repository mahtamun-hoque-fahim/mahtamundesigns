import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Mail, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError(authError.message); setLoading(false); return; }
    navigate("/admin");
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    if (resetError) { setError(resetError.message); setLoading(false); return; }
    setResetSent(true);
    setLoading(false);
    toast({ title: "Reset link sent", description: "Check your email for a password reset link." });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Admin <span className="text-primary">{mode === "login" ? "Login" : "Reset"}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {mode === "login" ? "Sign in to manage your site" : "Enter your email to reset password"}
          </p>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button type="submit" disabled={loading} className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <button type="button" onClick={() => { setMode("forgot"); setError(""); }} className="w-full text-sm text-muted-foreground hover:text-primary transition-colors">
              Forgot Password?
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {resetSent ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-foreground">A password reset link has been sent to <strong>{email}</strong>. Check your inbox and follow the link to set a new password.</p>
                <button onClick={() => { setMode("login"); setResetSent(false); }} className="flex items-center gap-2 mx-auto text-sm text-primary hover:text-primary/80 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" required />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <button type="submit" disabled={loading} className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
                <button type="button" onClick={() => { setMode("login"); setError(""); }} className="flex items-center gap-2 mx-auto text-sm text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
