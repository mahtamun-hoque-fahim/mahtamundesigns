import { Metadata } from 'next';
import Navbar from '@/components/sections/navbar';
import ContactHero from '@/components/sections/contact-hero';

export const metadata: Metadata = {
  title: 'Contact | Mahtamun',
  description: 'Get in touch with Mahtamun for your next design project.',
};

export default function ContactPage() {
  return (
    <main>
      <Navbar />
      <ContactHero />
    </main>
  );
}
