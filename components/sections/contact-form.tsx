'use client';

import { useState, FormEvent } from 'react';
import { Send, MessageCircle, Code2 } from 'lucide-react';

type FormData = {
  name: string;
  email: string;
  subject: string;
  time: string;
  details: string;
};

export default function ContactFormSection() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    time: '',
    details: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormData({ name: '', email: '', subject: '', time: '', details: '' });
        alert('Message sent successfully!');
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Error sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Flash animation — fires when navigated to via #contact-form hash */}
      <style>{`
        @keyframes form-flash {
          0%   { box-shadow: 0 0 0 0 rgba(187, 124, 255, 0); }
          30%  { box-shadow: 0 0 0 6px rgba(187, 124, 255, 0.35); }
          100% { box-shadow: 0 0 0 0 rgba(187, 124, 255, 0); }
        }
        #contact-form:target {
          animation: form-flash 1s ease-out;
        }
      `}</style>

      <section
        id="contact-form"
        className="bg-bg px-6 py-20 md:px-10 md:py-24 lg:px-12"
      >
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-3">

          {/* Left Sidebar */}
          <div className="space-y-16">

            {/* Get In Touch */}
            <div>
              <h3 className="font-display text-2xl font-bold text-white md:text-3xl">
                GET IN TOUCH
              </h3>
              <div className="mt-4 h-0.5 w-20 bg-accent" />
              <div className="mt-6 space-y-2 font-mono text-base text-white/70">
                <p>
                  Email:{' '}
                  <a
                    href="mailto:mahtamunhoquefahim@gmail.com"
                    className="font-semibold text-white transition-colors duration-300 hover:text-accent"
                  >
                    mahtamunhoquefahim@gmail.com
                  </a>
                </p>
                <p>
                  LinkedIn:{' '}
                  <a
                    href="https://www.linkedin.com/in/mahtamun-hoque-fahim"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-white transition-colors duration-300 hover:text-accent"
                  >
                    mahtamun-hoque-fahim
                  </a>
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-display text-2xl font-bold text-white md:text-3xl">
                SOCIAL MEDIA
              </h3>
              <div className="mt-4 h-0.5 w-20 bg-accent" />
              <div className="mt-6 flex gap-4">
                <SocialLink href="https://www.linkedin.com/in/mahtamun-hoque-fahim" label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.438-.103.249-.129.597-.129.946v5.421h-3.554s.045-8.789 0-9.704h3.554v1.374c.43-.664 1.199-1.61 2.920-1.61 2.134 0 3.753 1.395 3.753 4.402v5.538zM5.337 8.855c-1.144 0-1.915-.762-1.915-1.715 0-.955.77-1.715 1.959-1.715 1.188 0 1.916.76 1.932 1.715 0 .953-.744 1.715-1.976 1.715zm1.946 11.597H3.392V9.009h3.891v11.443zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                  </svg>
                </SocialLink>
                <SocialLink href="https://www.behance.net/mahtamunhoquefahim" label="Behance">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path d="M22 7h-7V5.5h7V7zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.619-5.564-4.3.023-2.68 2.488-4.3 5.191-4.3 1.933 0 3.723.996 4.512 2.231l-1.457.912c-.513-.815-1.393-1.438-3.05-1.438-2.026 0-3.457 1.26-3.457 3.15s1.453 3.323 3.486 3.323c1.917 0 2.96-.37 3.606-1.502h-2.34v-1.45h4.564l.073.947zm-8.101-5.461c.108-.035.236-.054.393-.054h3.879v1.404h-4.15c.108-.35.386-.855.878-1.35z" />
                  </svg>
                </SocialLink>
                <SocialLink href="https://dribbble.com/mahtamunhoquefahim" label="Dribbble">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm10.08-10.605c-.37-.116-3.32-.995-6.676-.457 1.4 3.84 1.969 6.966 2.078 7.63 2.368-1.603 4.057-4.136 4.598-7.173zm-5.895 8.067c-.158-.936-.78-4.22-2.28-8.12l-.064.02c-6.02 2.27-8.178 6.778-8.365 7.197C7.16 22.417 9.474 23.5 12 23.5c1.455 0 2.833-.32 4.069-.896l.116-.072zm-12.49-2.29c.247-.42 3.22-5.28 8.71-7.233.139-.047.28-.09.42-.13C12.43 10.13 11.86 8.28 11.67 7.75 6.15 9.446 1.8 9.396 1.52 9.39c-.002.204-.01.407-.01.61 0 3.55 1.462 6.76 3.844 9.065l.327.106zM2.05 7.59c.29.004 4.05-.016 9.24-1.44-1.657-2.94-3.44-5.415-3.72-5.815C4.97 1.785 3.09 4.45 2.05 7.59zM9.39 0c.296.41 2.09 2.886 3.73 5.88 3.547-1.33 5.048-3.35 5.23-3.61A9.956 9.956 0 0 0 12 0c-.9 0-1.774.12-2.61.34V0zM19.79 3.65c-.21.28-1.88 2.44-5.57 3.94.23.477.453.96.656 1.445.073.17.143.342.21.513 3.54-.445 7.058.267 7.41.342A9.987 9.987 0 0 0 19.79 3.65z" />
                  </svg>
                </SocialLink>
                <SocialLink href="https://www.figma.com/@fahim" label="Figma Community">
                  <Code2 size={24} />
                </SocialLink>
              </div>
            </div>

            {/* Emergency Enquiry */}
            <div>
              <h3 className="font-display text-2xl font-bold text-white md:text-3xl">
                EMERGENCY ENQUIRY:
              </h3>
              <div className="mt-4 h-0.5 w-20 bg-accent" />
              <a
                href="https://wa.me/8801795931345"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-none bg-accent/20 px-6 py-4 font-mono font-semibold text-white transition-all duration-300 hover:bg-accent hover:text-black"
              >
                <MessageCircle size={20} />
                DM NOW
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2">
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-none bg-surface/30 px-6 py-4 font-mono text-white placeholder-white/40 transition-all duration-300 focus:bg-surface/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-none bg-surface/30 px-6 py-4 font-mono text-white placeholder-white/40 transition-all duration-300 focus:bg-surface/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full rounded-none bg-surface/30 px-6 py-4 font-mono text-white placeholder-white/40 transition-all duration-300 focus:bg-surface/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
                <input
                  type="text"
                  name="time"
                  placeholder="Time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full rounded-none bg-surface/30 px-6 py-4 font-mono text-white placeholder-white/40 transition-all duration-300 focus:bg-surface/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>
              <textarea
                name="details"
                placeholder="Details"
                value={formData.details}
                onChange={handleChange}
                required
                rows={6}
                className="w-full resize-none rounded-none bg-surface/30 px-6 py-4 font-mono text-white placeholder-white/40 transition-all duration-300 focus:bg-surface/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-none bg-white px-8 py-3 font-mono font-semibold text-black transition-all duration-300 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={20} />
                  {isSubmitting ? 'SENDING...' : 'SEND'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-12 w-12 items-center justify-center rounded-none bg-surface/50 text-white transition-all duration-300 hover:bg-accent hover:text-black"
    >
      {children}
    </a>
  );
}
