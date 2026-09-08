import Link from "next/link";

interface NavItem {
  href: string;
  label: string;
}

interface TopNavProps {
  logo?: React.ReactNode;
  items?: NavItem[];
  signInHref?: string;
  ctaHref?: string;
  ctaLabel?: string;
  authenticated?: boolean;
  userName?: string;
}

export function TopNav({
  logo,
  items = [],
  signInHref = "/login",
  ctaHref = "/register",
  ctaLabel = "Sign Up Free",
  authenticated = false,
  userName,
}: TopNavProps) {
  return (
    <header className="sticky top-0 z-50 bg-canvas/90 backdrop-blur-md border-b border-hairline-soft">
      <nav className="mx-auto max-w-content px-base h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={authenticated ? "/dashboard" : "/"}
          className="flex items-center gap-2"
        >
          {logo || (
            <>
              <WalletIcon className="h-6 w-6 text-ink" />
              <span className="font-display text-display-sm text-ink leading-none mt-1">
                Ledger
              </span>
            </>
          )}
        </Link>

        {/* Center nav */}
        {items.length > 0 && (
          <ul className="hidden md:flex items-center gap-8">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-nav-link text-body-strong hover:text-ink transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {authenticated ? (
            <>
              <span className="hidden sm:block text-body-sm text-muted mr-1">
                Hi, {userName || "there"}
              </span>
              <Link
                href="/logout"
                className="btn-outline hidden sm:inline-flex"
              >
                Log Out
              </Link>
            </>
          ) : (
            <>
              <Link
                href={signInHref}
                className="btn-tertiary hidden sm:inline-flex"
              >
                Sign In
              </Link>
              <Link href={ctaHref} className="btn-primary">
                {ctaLabel}
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 512 448"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="63" width="416" height="322" rx="45" fill="#292524" />
      <rect
        x="352"
        y="160"
        width="144"
        height="176"
        rx="46"
        fill="#fff"
        stroke="#292524"
        strokeWidth="24"
      />
      <circle cx="420" cy="248" r="18" fill="#292524" />
    </svg>
  );
}
