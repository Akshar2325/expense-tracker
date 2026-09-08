import Link from "next/link";
import { GradientOrb } from "@/components/ui/orb";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AuthProvider } from "@/lib/auth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="relative min-h-screen bg-canvas flex flex-col">
        {/* Atmospheric orbs */}
        <GradientOrb color="mint" className="top-0 -left-24 w-96 h-96" />
        <GradientOrb
          color="lavender"
          className="top-1/3 -right-24 w-80 h-80"
          delay="6s"
        />
        <GradientOrb
          color="peach"
          className="bottom-0 left-1/4 w-72 h-72"
          delay="12s"
        />

        {/* Logo */}
        <header className="relative z-10 mx-auto max-w-content w-full px-base py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="font-display text-display-sm text-ink leading-none mt-1">
                Ledger
              </span>
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <main className="relative z-10 flex-1 flex items-center justify-center px-base pb-16">
          <div className="w-full max-w-md">{children}</div>
        </main>

        <footer className="relative z-10 text-center pb-8">
          <p className="text-body-sm text-muted-soft">
            © 2026 Ledger · A calm, private expense tracker
          </p>
        </footer>
      </div>
    </AuthProvider>
  );
}
