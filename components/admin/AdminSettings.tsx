'use client'
import { useState, useEffect } from "react";
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
const supabase = typeof window !== 'undefined' ? getSupabaseBrowserClient() : null as any;
import { useToast } from "@/components/ui/use-toast";
import {
  Lock, Mail, RefreshCw, Monitor, Smartphone, Tablet,
  Globe, Shield, LogOut, Clock, CheckCircle, XCircle, AlertTriangle, Bell, Eye
} from "lucide-react";
import {
  getSessionToken, terminateSession, terminateOtherSessions
} from "@/components/admin/useSessionManager";

type Session = {
  id: string;
  session_token: string;
  device_type: string;
  browser: string;
  os: string;
  ip_address: string;
  location: string;
  login_time: string;
  last_active: string;
  is_active: boolean;
  terminated_reason: string;
};

type LoginEntry = {
  id: string;
  device_type: string;
  browser: string;
  os: string;
  ip_address: string;
  location: string;
  login_time: string;
  success: boolean;
  failure_reason: string;
};

type SecurityAlert = {
  id: string;
  alert_type: string;
  severity: string;
  title: string;
  details: string;
  device_type: string;
  browser: string;
  os: string;
  ip_address: string;
  location: string;
  is_read: boolean;
  created_at: string;
};

function DeviceIcon({ type }: { type: string }) {
  if (/mobile/i.test(type)) return <Smartphone className="w-4 h-4" />;
  if (/tablet/i.test(type)) return <Tablet className="w-4 h-4" />;
  return <Monitor className="w-4 h-4" />;
}

function SeverityBadge({ severity }: { severity: string }) {
  const styles = {
    high: "bg-destructive/10 text-destructive",
    medium: "bg-amber-500/10 text-amber-600",
    low: "bg-blue-500/10 text-blue-600",
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${styles[severity as keyof typeof styles] || styles.medium}`}>
      {severity}
    </span>
  );
}

export function AdminSettings() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginEntry[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryVerified, setRecoveryVerified] = useState(false);
  const [recoveryInput, setRecoveryInput] = useState("");
  const [activeSection, setActiveSection] = useState<"password" | "sessions" | "history" | "recovery" | "alerts">("sessions");
  const { toast } = useToast();
  const currentToken = getSessionToken();

  const loadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const uid = session.user.id;

    const { data: sessData } = await (supabase as any)
      .from("admin_sessions")
      .select("*")
      .eq("user_id", uid)
      .order("login_time", { ascending: false })
      .limit(20);
    if (sessData) setSessions(sessData);

    const { data: histData } = await (supabase as any)
      .from("login_history")
      .select("*")
      .eq("user_id", uid)
      .order("login_time", { ascending: false })
      .limit(50);
    if (histData) setLoginHistory(histData);

    const { data: alertsData } = await (supabase as any)
      .from("security_alerts")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .limit(50);
    if (alertsData) setSecurityAlerts(alertsData);

    const { data: settingsData } = await (supabase as any)
      .from("admin_settings")
      .select("*")
      .eq("user_id", uid)
      .maybeSingle();
    if (settingsData) {
      setRecoveryEmail(settingsData.recovery_email || "");
      setRecoveryVerified(settingsData.recovery_email_verified || false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Password updated successfully" }); setNewPassword(""); setConfirmPassword(""); }
    setSaving(false);
  };

  const handleSendResetEmail = async () => {
    const { data } = await supabase.auth.getSession();
    const email = data.session?.user?.email;
    if (!email) return;
    setSaving(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Reset email sent", description: "Check your inbox for the reset link" });
    setSaving(false);
  };

  const handleTerminateSession = async (id: string) => {
    await terminateSession(id);
    toast({ title: "Session terminated" });
    loadData();
  };

  const handleTerminateOthers = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await terminateOtherSessions(session.user.id);
    toast({ title: "All other sessions terminated" });
    loadData();
  };

  const handleSaveRecoveryEmail = async () => {
    if (!recoveryInput || !recoveryInput.includes("@")) {
      toast({ title: "Error", description: "Enter a valid email", variant: "destructive" });
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    setSaving(true);
    const { error } = await (supabase as any)
      .from("admin_settings")
      .upsert({
        user_id: session.user.id,
        recovery_email: recoveryInput,
        recovery_email_verified: false,
      }, { onConflict: "user_id" });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Recovery email saved", description: "Verification would be sent in production." });
      setRecoveryEmail(recoveryInput);
      setRecoveryVerified(false);
    }
    setSaving(false);
  };

  const handleMarkAlertRead = async (alertId: string) => {
    await (supabase as any)
      .from("security_alerts")
      .update({ is_read: true })
      .eq("id", alertId);
    setSecurityAlerts((prev) => prev.map((a) => a.id === alertId ? { ...a, is_read: true } : a));
  };

  const handleMarkAllAlertsRead = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await (supabase as any)
      .from("security_alerts")
      .update({ is_read: true })
      .eq("user_id", session.user.id)
      .eq("is_read", false);
    setSecurityAlerts((prev) => prev.map((a) => ({ ...a, is_read: true })));
    toast({ title: "All alerts marked as read" });
  };

  const unreadAlerts = securityAlerts.filter((a) => !a.is_read).length;

  const tabs = [
    { id: "sessions" as const, label: "Active Sessions", icon: Monitor },
    { id: "alerts" as const, label: "Security Alerts", icon: Bell, badge: unreadAlerts },
    { id: "history" as const, label: "Login History", icon: Clock },
    { id: "password" as const, label: "Password", icon: Lock },
    { id: "recovery" as const, label: "Recovery Email", icon: Mail },
  ];

  const activeSessions = sessions.filter((s) => s.is_active);

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary" />
        Account & Security
      </h2>

      {/* Tab navigation */}
      <div className="flex gap-1 mb-6 bg-muted/50 p-1 rounded-lg flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveSection(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-display font-semibold transition-colors ${
              activeSection === t.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
            {t.badge ? (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-destructive text-destructive-foreground rounded-full leading-none">
                {t.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Active Sessions */}
      {activeSection === "sessions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {activeSessions.length} active session{activeSessions.length !== 1 ? "s" : ""}
            </p>
            {activeSessions.length > 1 && (
              <button
                onClick={handleTerminateOthers}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-destructive border border-destructive/30 rounded-md hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-3 h-3" />
                Log Out Other Devices
              </button>
            )}
          </div>

          {sessions.slice(0, 10).map((s) => {
            const isCurrent = s.session_token === currentToken && s.is_active;
            return (
              <div
                key={s.id}
                className={`bg-card border rounded-xl p-4 ${
                  isCurrent ? "border-primary/50 ring-1 ring-primary/20" : "border-border"
                } ${!s.is_active ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isCurrent ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      <DeviceIcon type={s.device_type} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{s.device_type}</span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary rounded-full">
                            Current Device
                          </span>
                        )}
                        {!s.is_active && (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground rounded-full">
                            Terminated
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <p>{s.browser} · {s.os}</p>
                        {s.location && (
                          <p className="flex items-center gap-1">
                            <Globe className="w-3 h-3" /> {s.location}
                          </p>
                        )}
                        {s.ip_address && <p>IP: {s.ip_address}</p>}
                        <p>Login: {new Date(s.login_time).toLocaleString()}</p>
                        {s.is_active && <p>Last active: {new Date(s.last_active).toLocaleString()}</p>}
                      </div>
                    </div>
                  </div>
                  {s.is_active && !isCurrent && (
                    <button
                      onClick={() => handleTerminateSession(s.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-destructive border border-destructive/30 rounded-md hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="w-3 h-3" />
                      Terminate
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Security Alerts */}
      {activeSection === "alerts" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {unreadAlerts > 0 ? `${unreadAlerts} unread alert${unreadAlerts !== 1 ? "s" : ""}` : "No unread alerts"}
            </p>
            {unreadAlerts > 0 && (
              <button
                onClick={handleMarkAllAlertsRead}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-primary border border-primary/30 rounded-md hover:bg-primary/10 transition-colors"
              >
                <Eye className="w-3 h-3" />
                Mark All Read
              </button>
            )}
          </div>

          {securityAlerts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Shield className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No security alerts. Your account looks safe.</p>
            </div>
          )}

          {securityAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-card border rounded-xl p-4 ${
                !alert.is_read ? "border-amber-500/40 ring-1 ring-amber-500/10" : "border-border opacity-70"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    alert.severity === "high" ? "bg-destructive/10 text-destructive" : "bg-amber-500/10 text-amber-600"
                  }`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{alert.title}</span>
                      <SeverityBadge severity={alert.severity} />
                      {!alert.is_read && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{alert.details}</p>
                    <div className="text-xs text-muted-foreground space-y-0.5 mt-2">
                      <p><DeviceIcon type={alert.device_type} /> {alert.device_type} · {alert.browser} · {alert.os}</p>
                      {alert.location && (
                        <p className="flex items-center gap-1">
                          <Globe className="w-3 h-3" /> {alert.location}
                        </p>
                      )}
                      {alert.ip_address && <p>IP: {alert.ip_address}</p>}
                      <p>{new Date(alert.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                {!alert.is_read && (
                  <button
                    onClick={() => handleMarkAlertRead(alert.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-muted-foreground border border-border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Login History */}
      {activeSection === "history" && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground mb-4">Recent login attempts</p>
          {loginHistory.length === 0 && (
            <p className="text-sm text-muted-foreground">No login history yet.</p>
          )}
          {loginHistory.map((entry) => (
            <div key={entry.id} className="bg-card border border-border rounded-lg p-3 flex items-center gap-3">
              <div className={`p-1.5 rounded-md ${entry.success ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"}`}>
                {entry.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">{entry.device_type}</span>
                  <span className="text-xs text-muted-foreground">{entry.browser} · {entry.os}</span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  {entry.location && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{entry.location}</span>}
                  {entry.ip_address && <span>IP: {entry.ip_address}</span>}
                </div>
                {!entry.success && entry.failure_reason && (
                  <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
                    <AlertTriangle className="w-3 h-3" />{entry.failure_reason}
                  </p>
                )}
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(entry.login_time).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Password */}
      {activeSection === "password" && (
        <div className="space-y-6 max-w-md">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-display font-semibold text-foreground">Change Password</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary/50 focus:outline-none"
                  placeholder="Min 6 characters" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary/50 focus:outline-none"
                  placeholder="Repeat password" />
              </div>
              <button onClick={handleChangePassword} disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 disabled:opacity-50">
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Update Password
              </button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-display font-semibold text-foreground">Password Reset via Email</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Send a password reset link to your registered email address.
            </p>
            <button onClick={handleSendResetEmail} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-md text-sm font-semibold text-foreground hover:bg-muted/50 disabled:opacity-50">
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              Send Reset Link
            </button>
          </div>
        </div>
      )}

      {/* Recovery Email */}
      {activeSection === "recovery" && (
        <div className="max-w-md">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-display font-semibold text-foreground">Recovery Email</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              A recovery email can be used to regain access to your account if you lose your primary email.
            </p>

            {recoveryEmail && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{recoveryEmail}</span>
                <span className={`ml-auto px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                  recoveryVerified
                    ? "bg-green-500/10 text-green-600"
                    : "bg-amber-500/10 text-amber-600"
                }`}>
                  {recoveryVerified ? "Verified" : "Unverified"}
                </span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  {recoveryEmail ? "Update Recovery Email" : "Add Recovery Email"}
                </label>
                <input type="email" value={recoveryInput} onChange={(e) => setRecoveryInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary/50 focus:outline-none"
                  placeholder="backup@example.com" />
              </div>
              <button onClick={handleSaveRecoveryEmail} disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 disabled:opacity-50">
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                {recoveryEmail ? "Update" : "Save"} Recovery Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
