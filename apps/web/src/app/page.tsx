import Link from "next/link";
import { TopNav } from "@/components/layout/top-nav";
import { GradientOrb, GradientOrbCard } from "@/components/ui/orb";
import { Card } from "@/components/ui/card";

const features = [
  {
    title: "Track every rupee",
    body: "Capture expenses and income in seconds. Categorize automatically, reconcile across accounts, and always know where your money went.",
    icon: "track",
  },
  {
    title: "Budgets that breathe",
    body: "Set monthly budgets per category. Watch progress bars fill in real time, with gentle warnings before you overshoot.",
    icon: "budget",
  },
  {
    title: "Reports that read like stories",
    body: "Category breakdowns, monthly trends, and savings insights — rendered as clean editorial charts, not spreadsheets.",
    icon: "report",
  },
  {
    title: "Recurring, handled",
    body: "Rent, subscriptions, EMIs. Define them once and let Ledger create them on schedule, automatically.",
    icon: "recurring",
  },
  {
    title: "Private by design",
    body: "Argon2id password hashing, JWT sessions, and your data stays yours. No ads, no selling data, ever.",
    icon: "privacy",
  },
  {
    title: "Sync across devices",
    body: "Offline-first sync with cursor-based reconciliation. Your ledger is always current, wherever you are.",
    icon: "sync",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-canvas">
      <TopNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <GradientOrb color="mint" className="top-10 -left-24 w-96 h-96" />
        <GradientOrb
          color="lavender"
          className="top-40 -right-24 w-80 h-80"
          delay="6s"
        />
        <GradientOrb
          color="peach"
          className="bottom-0 left-1/3 w-72 h-72"
          delay="12s"
        />

        <div className="relative z-10 mx-auto max-w-content px-base py-section text-center">
          <span className="badge mb-8">Personal Finance, Editorial</span>
          <h1 className="font-display text-display-mega text-ink max-w-3xl mx-auto leading-[1.05]">
            Your money, told
            <br />
            <em className="not-italic text-body">in a quiet ledger.</em>
          </h1>
          <p className="mt-8 text-body-md text-muted max-w-xl mx-auto">
            Ledger is a calm, private expense tracker. Track spending, set
            budgets, and read your finances like a well-edited magazine — no
            noise, no neon, just clarity.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/register" className="btn-primary">
              Start Tracking Free
            </Link>
            <Link href="/login" className="btn-outline">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="mx-auto max-w-content px-base pb-section">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title} interactive className="p-6">
              <div className="h-8 w-8 rounded-full bg-surface-strong flex items-center justify-center mb-4">
                <FeatureIcon name={f.icon} />
              </div>
              <h3 className="text-title-md text-ink mb-2">{f.title}</h3>
              <p className="text-body-sm text-muted leading-relaxed">
                {f.body}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Gradient orb CTA band */}
      <section className="mx-auto max-w-content px-base pb-section">
        <GradientOrbCard color="sky" className="text-center py-xxl">
          <h2 className="font-display text-display-lg text-ink">
            Begin with a clean page.
          </h2>
          <p className="mt-4 text-body-md text-muted max-w-md mx-auto">
            Set up your first account and category in under a minute. Your
            ledger starts empty — and beautifully so.
          </p>
          <div className="mt-8">
            <Link href="/register" className="btn-primary">
              Create Your Ledger
            </Link>
          </div>
        </GradientOrbCard>
      </section>

      {/* Footer */}
      <footer className="border-t border-hairline-soft bg-canvas">
        <div className="mx-auto max-w-content px-base py-xxl grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <span className="font-display text-display-sm text-ink">
              Ledger
            </span>
            <p className="mt-3 text-body-sm text-muted max-w-xs">
              A calm, private expense tracker. Built with care, designed with
              restraint.
            </p>
          </div>
          {[
            {
              title: "Product",
              links: ["Dashboard", "Transactions", "Budgets", "Reports"],
            },
            { title: "Company", links: ["About", "Privacy", "Terms"] },
            { title: "Resources", links: ["Docs", "API", "Status"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-caption-uppercase text-muted mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link
                      href="#"
                      className="text-body-sm text-body hover:text-ink transition-colors"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-hairline-soft">
          <div className="mx-auto max-w-content px-base py-6 flex items-center justify-between">
            <p className="text-body-sm text-muted">
              © 2026 Ledger. All rights reserved.
            </p>
            <p className="text-body-sm text-muted-soft">Made with restraint.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    track: (
      <svg
        className="h-4 w-4 text-ink"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3v18h18" />
        <path d="M7 15l4-6 4 3 5-7" />
      </svg>
    ),
    budget: (
      <svg
        className="h-4 w-4 text-ink"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    report: (
      <svg
        className="h-4 w-4 text-ink"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />
      </svg>
    ),
    recurring: (
      <svg
        className="h-4 w-4 text-ink"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12a9 9 0 1 1-2.64-6.36" />
        <path d="M21 3v6h-6" />
      </svg>
    ),
    privacy: (
      <svg
        className="h-4 w-4 text-ink"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    sync: (
      <svg
        className="h-4 w-4 text-ink"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 2l4 4-4 4" />
        <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
        <path d="M7 22l-4-4 4-4" />
        <path d="M21 13v1a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  };
  return <>{paths[name]}</>;
}
