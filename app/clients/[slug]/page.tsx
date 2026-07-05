import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getClient } from "@/lib/clients";
import { Navbar } from "@/components/sections/navbar";
import { ClientHero } from "@/components/sections/client-hero";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const client = getClient(slug);
  if (!client) return { title: "Not Found" };
  return {
    title: `${client.name} | Mahtamun`,
    description: `Design work done for ${client.name} — ${client.tagline}`,
  };
}

export default async function ClientPage({ params }: Props) {
  const { slug } = await params;
  const client = getClient(slug);
  if (!client) notFound();

  return (
    <>
      <Navbar />
      <ClientHero client={client} />
      {/* About + At a Glance — next section */}
      {/* Gallery — after that */}
      {/* Secondary CTA + Footer — last */}
    </>
  );
}
