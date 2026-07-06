export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getClient } from "@/lib/clients";
import { ClientEditForm } from "./client-edit-form";

type Props = { params: Promise<{ slug: string }> };

export default async function EditClientPage({ params }: Props) {
  const { slug } = await params;
  const client = await getClient(slug);
  if (!client) notFound();

  return <ClientEditForm client={client} />;
}
