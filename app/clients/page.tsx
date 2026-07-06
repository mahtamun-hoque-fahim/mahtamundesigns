import { redirect } from "next/navigation";

// /clients with no slug — redirect to portfolio.
// Once 30+ client pages exist they're all at /clients/[slug],
// nothing lives at the index itself.
export default function ClientsIndex() {
  redirect("/portfolio");
}
