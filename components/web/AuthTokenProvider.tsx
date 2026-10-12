import type { PropsWithChildren } from "react";
import { getToken } from "@/lib/auth-server";
import { ConvexClientProvider } from "./ConvexClientProvider";

export async function AuthTokenProvider({ children }: PropsWithChildren) {
  const token = await getToken();

  return (
    <ConvexClientProvider initialToken={token}>
      {children}
    </ConvexClientProvider>
  );
}
