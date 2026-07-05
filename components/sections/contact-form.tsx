'use client';

import { useState, FormEvent } from 'react';
import { Send, Linkedin, Dribbble, Code2, MessageCircle } from 'lucide-react';
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
                  href="https://linkedin.com/in/mahtamun-hoque-fahim"
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
                href="https://linkedin.com/in/mahtamun-hoque-fahim"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface/50 text-white transition-all duration-300 hover:bg-accent hover:text-black focus:outline-none focus:ring-2 focus:ring-accent/50"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>

              {/* Behance */}
              <a
                href="#behance"
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
                href="#dribbble"
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface/50 text-white transition-all duration-300 hover:bg-accent hover:text-black focus:outline-none focus:ring-2 focus:ring-accent/50"
                aria-label="Dribbble"
              >
                <Dribbble size={24} />
              </a>

              {/* Figma Community */}
              <a
                href="#figma"
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
              href="#whatsapp"
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
