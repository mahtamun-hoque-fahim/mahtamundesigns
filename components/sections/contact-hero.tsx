'use client';

import { MessageCircle, Calendar } from 'lucide-react';

export default function ContactHero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/contact-hero.webp)',
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-6 text-center sm:px-8">
        {/* Heading */}
        <h1 className="font-display text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
          CONTACT
        </h1>

        {/* Subtitle */}
        <p className="font-mono text-lg text-white/80 sm:text-xl">
          Let&apos;s build something, which attracts clients client.
        </p>

        {/* CTA Buttons */}
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:gap-6">
          {/* Send Message Button */}
          <a
            href="#send-message"
            className="group relative inline-flex items-center gap-2 bg-white px-8 py-3 font-mono font-semibold text-black transition-all duration-300 ease-out hover:gap-3 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <MessageCircle size={20} />
            SEND MESSAGE
          </a>

          {/* Book a Meeting Button */}
          <a
            href="#book-meeting"
            className="group relative inline-flex items-center gap-2 border-2 border-white px-8 py-3 font-mono font-semibold text-white transition-all duration-300 ease-out hover:border-white/70 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <Calendar size={20} />
            BOOK A MEETING
          </a>
        </div>
      </div>
    </section>
  );
}
