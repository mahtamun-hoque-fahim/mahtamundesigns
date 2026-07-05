'use client';

import { useState, FormEvent } from 'react';
import { Send, Mail, Code2, MessageCircle } from 'lucide-react';
import Image from 'next/image';

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API endpoint when backend is ready
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
    <section className="bg-bg px-6 py-20 md:px-10 md:py-24 lg:px-12">
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
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/mahtamun-hoque-fahim"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface/50 text-white transition-all duration-300 hover:bg-accent hover:text-black focus:outline-none focus:ring-2 focus:ring-accent/50"
                aria-label="LinkedIn"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.438-.103.249-.129.597-.129.946v5.421h-3.554s.045-8.789 0-9.704h3.554v1.374c.43-.664 1.199-1.61 2.920-1.61 2.134 0 3.753 1.395 3.753 4.402v5.538zM5.337 8.855c-1.144 0-1.915-.762-1.915-1.715 0-.955.77-1.715 1.959-1.715 1.188 0 1.916.76 1.932 1.715 0 .953-.744 1.715-1.976 1.715zm1.946 11.597H3.392V9.009h3.891v11.443zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
              </a>

              {/* Behance */}
              <a
                href="https://www.behance.net/mahtamunhoquefahim"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface/50 text-white transition-all duration-300 hover:bg-accent hover:text-black focus:outline-none focus:ring-2 focus:ring-accent/50"
                aria-label="Behance"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                >
                  <path d="M22 7h-7V5.5h7V7zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.619-5.564-4.3.023-2.68 2.488-4.3 5.191-4.3 1.933 0 3.723.996 4.512 2.231l-1.457.912c-.513-.815-1.393-1.438-3.05-1.438-2.026 0-3.457 1.26-3.457 3.15s1.453 3.323 3.486 3.323c1.917 0 2.96-.37 3.606-1.502h-2.34v-1.45h4.564l.073.947zm-8.101-5.461c.108-.035.236-.054.393-.054h3.879v1.404h-4.15c.108-.35.386-.855.878-1.35z" />
                </svg>
              </a>

              {/* Dribbble */}
              <a
                href="https://dribbble.com/mahtamunhoquefahim"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface/50 text-white transition-all duration-300 hover:bg-accent hover:text-black focus:outline-none focus:ring-2 focus:ring-accent/50"
                aria-label="Dribbble"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                >
                  <path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm8.527-14.115c-.282-.79-1.04-1.53-2.347-2.216.607-1.52 1.064-3.09 1.345-4.708.244-1.414.373-2.937.373-4.46 0-.79-.03-1.58-.09-2.37-.088-.908-.25-1.822-.483-2.736-.162-.63-.343-1.244-.542-1.843.15.355.3.71.448 1.068.297.712.56 1.436.79 2.17.282.918.513 1.85.695 2.79.252 1.312.368 2.628.368 3.95 0 1.256-.09 2.502-.27 3.74-.14.988-.347 1.964-.622 2.928zm-7.527 3.385c1.59 0 3.13-.32 4.58-.94-1.225-1.985-2.848-3.66-4.726-4.848-1.206.74-2.246 1.71-3.044 2.828 1.04.914 2.285 1.647 3.703 2.095.4.11.81.165 1.487.165zm-5.97-6.14c.937-1.32 2.256-2.374 3.76-3.068.45-.22.92-.415 1.404-.585-.49-1.23-1.085-2.415-1.78-3.545-.487-.79-1.03-1.53-1.627-2.21.088.328.176.66.26.998.353 1.418.513 2.843.513 4.27 0 .895-.08 1.76-.23 2.595zm5.97 10.01c-1.59 0-3.13-.32-4.58-.94 1.225-1.985 2.848-3.66 4.726-4.848 1.206.74 2.246 1.71 3.044 2.828-1.04.914-2.285 1.647-3.703 2.095-.4.11-.81.165-1.487.165zm5.97-6.14c-.937 1.32-2.256 2.374-3.76 3.068-.45.22-.92.415-1.404.585.49 1.23 1.085 2.415 1.78 3.545.487.79 1.03 1.53 1.627 2.21-.088-.328-.176-.66-.26-.998-.353-1.418-.513-2.843-.513-4.27 0-.895.08-1.76.23-2.595zm-2.5-8.138c.282.79 1.04 1.53 2.347 2.216-.607 1.52-1.064 3.09-1.345 4.708-.244 1.414-.373 2.937-.373 4.46 0 .79.03 1.58.09 2.37.088.908.25 1.822.483 2.736.162.63.343 1.244.542 1.843-.15-.355-.3-.71-.448-1.068-.297-.712-.56-1.436-.79-2.17-.282-.918-.513-1.85-.695-2.79-.252-1.312-.368-2.628-.368-3.95 0-1.256.09-2.502.27-3.74.14-.988.347-1.964.622-2.928z" />
                </svg>
              </a>

              {/* Figma Community */}
              <a
                href="https://www.figma.com/@fahim"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface/50 text-white transition-all duration-300 hover:bg-accent hover:text-black focus:outline-none focus:ring-2 focus:ring-accent/50"
                aria-label="Figma Community"
              >
                <Code2 size={24} />
              </a>
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
              className="group relative mt-6 inline-flex items-center gap-2 bg-accent-dim px-6 py-4 font-mono font-semibold text-white transition-all duration-300 ease-out hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              <MessageCircle size={20} />
              DM NOW
            </a>
          </div>
        </div>

        {/* Right Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2"
        >
          <div className="space-y-4">
            {/* Name Input */}
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-surface/30 px-6 py-4 font-mono text-white placeholder-white/40 transition-all duration-300 focus:bg-surface/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
            />

            {/* Email Input */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-surface/30 px-6 py-4 font-mono text-white placeholder-white/40 transition-all duration-300 focus:bg-surface/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
            />

            {/* Subject & Time Row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full bg-surface/30 px-6 py-4 font-mono text-white placeholder-white/40 transition-all duration-300 focus:bg-surface/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              <input
                type="text"
                name="time"
                placeholder="Time"
                value={formData.time}
                onChange={handleChange}
                className="w-full bg-surface/30 px-6 py-4 font-mono text-white placeholder-white/40 transition-all duration-300 focus:bg-surface/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>

            {/* Details Textarea */}
            <textarea
              name="details"
              placeholder="Details"
              value={formData.details}
              onChange={handleChange}
              required
              rows={6}
              className="w-full bg-surface/30 px-6 py-4 font-mono text-white placeholder-white/40 transition-all duration-300 focus:bg-surface/50 focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
            />

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 bg-white px-8 py-3 font-mono font-semibold text-black transition-all duration-300 ease-out hover:gap-3 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <Send size={20} />
                {isSubmitting ? 'SENDING...' : 'SEND'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
