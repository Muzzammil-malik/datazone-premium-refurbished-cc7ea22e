import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { BackToTop } from "./BackToTop";
import { CartDrawer } from "./CartDrawer";
import { WishlistDrawer } from "./WishlistDrawer";
import { CompareBar, CompareDrawer } from "./CompareTray";
import { useAdmin } from "@/lib/admin-store";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const settings = useAdmin((s) => s.settings);
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }
  return (
    <div className="min-h-dvh flex flex-col">
      <Nav />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
      <BackToTop />
      <CartDrawer />
      <WishlistDrawer />
      <CompareBar />
      <CompareDrawer />
      <a
        href={`https://wa.me/${settings.whatsapp || "919999999999"}`}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp support"
        className="fixed bottom-6 left-6 z-40 grid place-items-center size-12 rounded-full bg-foreground text-background shadow-lg hover:scale-110 transition"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
          <path d="M20.5 3.5A11 11 0 0 0 3.4 17.2L2 22l4.9-1.3A11 11 0 1 0 20.5 3.5Zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-2.9.8.8-2.8-.2-.3A9 9 0 1 1 12 20.5Zm5-6.7c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4a8.6 8.6 0 0 1-1.6-2c-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.7-.9-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2.1 3.2 5 4.4 2.9 1.2 2.9.8 3.4.7.5-.1 1.6-.6 1.8-1.2.2-.6.2-1.1.2-1.3-.1-.1-.3-.2-.6-.3Z"/>
        </svg>
      </a>
    </div>
  );
}