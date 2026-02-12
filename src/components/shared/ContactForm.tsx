import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactFormProps {
  className?: string;
}

export function ContactForm({ className }: ContactFormProps) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;

    setSending(true);
    try {
      const mailtoUrl = `mailto:mahtamunhoquefahim@pm.me?subject=${encodeURIComponent(form.subject || `Portfolio Contact from ${form.name}`)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`)}`;
      window.open(mailtoUrl, "_blank");
      toast({ title: "Message ready!", description: "Your email client should open shortly." });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

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
