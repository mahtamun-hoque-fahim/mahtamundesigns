import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContactFormProps {
  className?: string;
  sourcePage?: string;
}

export function ContactForm({ className, sourcePage = "/contact" }: ContactFormProps) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;

    setSending(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        source_page: sourcePage,
      });

      if (error) throw error;

      // Trigger notification edge function (fire-and-forget)
      supabase.functions.invoke("notify-contact", {
        body: { name: form.name.trim(), email: form.email.trim(), subject: form.subject.trim() },
      }).catch(() => {});

      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast({ title: "Message sent!", description: "I'll get back to you soon." });
    } catch {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className={className}>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CheckCircle className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-xl font-display font-bold mb-2">Thank you!</h3>
          <p className="text-muted-foreground mb-6">Your message has been received. I'll get back to you soon.</p>
          <Button variant="outline" onClick={() => setSent(false)}>Send Another Message</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
          maxLength={100}
          className="bg-background border-border h-12"
        />
        <Input
          type="email"
          placeholder="Your Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          required
          maxLength={255}
          className="bg-background border-border h-12"
        />
      </div>
      <Input
        placeholder="Subject"
        value={form.subject}
        onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
        maxLength={200}
        className="bg-background border-border h-12 mt-4"
      />
      <Textarea
        placeholder="Your Message"
        value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        required
        maxLength={1000}
        className="bg-background border-border min-h-[140px] resize-none mt-4"
      />
      <Button variant="hero" type="submit" disabled={sending} className="mt-4 self-start h-12 px-8">
        <Send className="w-4 h-4 mr-2" />
        {sending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
