import Link from "next/link";
import { TopNav } from "@/components/layout/top-nav";
import { GradientOrb } from "@/components/ui/orb";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/docs", label: "Docs" },
  { href: "/status", label: "Status" },
];

export function StaticPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <TopNav items={navItems} />
      <main className="relative flex-1 overflow-hidden">
        <GradientOrb color="mint" className="top-0 -left-24 w-96 h-96" />
        <GradientOrb
          color="lavender"
          className="top-1/3 -right-24 w-80 h-80"
          delay="6s"
        />
        <div className="relative z-10 mx-auto max-w-content px-base py-section">
          <span className="badge mb-6">Ledger</span>
          <h1 className="font-display text-display-mega text-ink leading-[1.05]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 text-body-md text-muted max-w-2xl">{subtitle}</p>
          )}
          <div className="mt-12 max-w-3xl">{children}</div>
        </div>
      </main>
      <footer className="border-t border-hairline-soft bg-canvas">
        <div className="mx-auto max-w-content px-base py-6 flex items-center justify-between">
          <p className="text-body-sm text-muted">
            © 2026 Ledger. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-body-sm text-muted hover:text-ink transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-body-sm text-muted hover:text-ink transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/docs"
              className="text-body-sm text-muted hover:text-ink transition-colors"
            >
              Docs
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
