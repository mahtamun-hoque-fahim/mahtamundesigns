import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { Send, Instagram, Globe, Dribbble, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const socials = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Globe, label: "Behance", href: "#" },
  { icon: Dribbble, label: "Dribbble", href: "#" },
  { icon: Mail, label: "Email", href: "mailto:mahtamunhoquefahim@pm.me" },
];

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const { ref, isInView } = useInView();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;

    setSending(true);
    try {
      const mailtoUrl = `mailto:mahtamunhoquefahim@pm.me?subject=${encodeURIComponent(`Portfolio Contact from ${form.name}`)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`)}`;
      window.open(mailtoUrl, "_blank");
      toast({ title: "Message ready!", description: "Your email client should open shortly." });
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <section ref={ref} className="py-24 md:py-32 bg-card border-y border-border/50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {/* Left: Info + Socials */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4">
              Let's <span className="text-primary">Talk</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Have a project in mind or just want to say hello? I'd love to hear from you. Drop me a message and I'll get back to you soon.
            </p>

            <div className="flex gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300"
                >
                  <s.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-5"
          >
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
            <Textarea
              placeholder="Your Message"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              required
              maxLength={1000}
              className="bg-background border-border min-h-[140px] resize-none"
            />
            <Button variant="hero" type="submit" disabled={sending} className="self-start h-12 px-8">
              <Send className="w-4 h-4 mr-2" />
              {sending ? "Sending..." : "Send Message"}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
