import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Mail, ArrowLeft, AlertTriangle, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { recordLogin, recordFailedLogin } from "@/hooks/useSessionManager";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "forgot" | "emergency">("login");
  const [resetSent, setResetSent] = useState(false);
  const [sessionMessage, setSessionMessage] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const reason = searchParams.get("reason");
    if (reason === "session_terminated") {
      setSessionMessage("Your session was terminated because your account was logged in from another device.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSessionMessage("");
    setLoading(true);
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      recordFailedLogin(null, authError.message, "email");
      setLoading(false);
      return;
    }
    if (data.session) {
      await recordLogin(data.session.user.id, "email");
    }
    navigate("/admin");
  };

  const handleEmergencyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSessionMessage("");
    setLoading(true);

    try {
      const res = await supabase.functions.invoke("emergency-login", {
        body: { email, password },
      });

      if (res.error || !res.data?.hashed_token) {
        const errMsg = res.data?.error || res.error?.message || "Emergency login failed";
        setError(errMsg);
        recordFailedLogin(null, errMsg, "emergency");
        setLoading(false);
        return;
      }

      // Verify the OTP token to get a real session
      const { data: otpData, error: otpError } = await supabase.auth.verifyOtp({
        token_hash: res.data.hashed_token,
        type: "magiclink",
      });

      if (otpError || !otpData.session) {
        setError(otpError?.message || "Failed to establish session");
        recordFailedLogin(null, otpError?.message || "OTP verification failed", "emergency");
        setLoading(false);
        return;
      }

      await recordLogin(otpData.session.user.id, "emergency");
      toast({
        title: "Emergency Login",
        description: "Logged in using emergency credentials. This login has been recorded.",
        variant: "destructive",
      });
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Emergency login failed");
      setLoading(false);
    }
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

  const getTitle = () => {
    if (mode === "emergency") return "Emergency";
    if (mode === "forgot") return "Reset";
    return "Login";
  };

  const getSubtitle = () => {
    if (mode === "emergency") return "Use emergency master credentials";
    if (mode === "forgot") return "Enter your email to reset password";
    return "Sign in to manage your site";
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Admin <span className="text-primary">{getTitle()}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">{getSubtitle()}</p>
        </div>

        {sessionMessage && (
          <div className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">{sessionMessage}</p>
          </div>
        )}

        {mode === "emergency" && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Emergency credentials can only be used <strong>once per 30 days</strong>. This login will be recorded and security alerts will be sent.
            </p>
          </div>
        )}

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
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => { setMode("forgot"); setError(""); }} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Forgot Password?
              </button>
              <button type="button" onClick={() => { setMode("emergency"); setError(""); setEmail(""); setPassword(""); }} className="text-xs text-muted-foreground/50 hover:text-destructive transition-colors">
                Emergency Access
              </button>
            </div>
          </form>
        ) : mode === "emergency" ? (
          <form onSubmit={handleEmergencyLogin} className="space-y-4">
            <div className="relative">
              <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="email" placeholder="Master Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/50" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="password" placeholder="Master Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/50" required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button type="submit" disabled={loading} className="w-full h-11 rounded-lg bg-destructive text-destructive-foreground font-display font-semibold text-sm hover:bg-destructive/90 transition-colors disabled:opacity-50">
              {loading ? "Authenticating..." : "Emergency Sign In"}
            </button>
            <button type="button" onClick={() => { setMode("login"); setError(""); setEmail(""); setPassword(""); }} className="flex items-center gap-2 mx-auto text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Login
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
