export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getClient } from "@/lib/clients";
import { Navbar } from "@/components/sections/navbar";
import { ClientHero } from "@/components/sections/client-hero";
import { ClientAbout } from "@/components/sections/client-about";
import { ClientGallery } from "@/components/sections/client-gallery";
import { SecondaryCta } from "@/components/sections/secondary-cta";
import { Footer } from "@/components/sections/footer";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const client = await getClient(slug);
  if (!client) return { title: "Not Found" };
  return {
    title: `${client.name} | Mahtamun`,
    description: `Design work done for ${client.name} — ${client.tagline}`,
  };
}

const CLIENT_CTA_SET = {
  eyebrow: "DISCUSS YOUR",
  heading: "PAIN POINT",
  buttonLabel: "DM NOW",
  buttonHref: "#contact",
  motivation: { name: null, role: null, quote: null, avatar: null },
};

export default async function ClientPage({ params }: Props) {
  const { slug } = await params;
  const client = await getClient(slug);
  if (!client) notFound();

  return (
    <>
      <Navbar />
      <ClientHero client={client} />
      <ClientAbout client={client} />
      <ClientGallery client={client} />
      <SecondaryCta set={CLIENT_CTA_SET} />
      <Footer />
    </>
  );
}
