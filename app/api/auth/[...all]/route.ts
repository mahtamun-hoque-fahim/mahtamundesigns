export const dynamic = "force-dynamic";

import { getAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler((req) => {
  const auth = getAuth();
  return auth.handler(req);
});

export const { GET, POST } = handler;
