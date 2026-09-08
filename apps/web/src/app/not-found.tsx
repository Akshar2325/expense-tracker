import Link from "next/link";
import { GradientOrb } from "@/components/ui/orb";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <GradientOrb
        color="lavender"
        className="top-0 -right-40 w-96 h-96 opacity-30"
      />
      <GradientOrb
        color="mint"
        className="bottom-0 -left-40 w-80 h-80 opacity-30"
        delay="8s"
      />

      <div className="relative w-full max-w-md text-center">
        <p className="font-display text-display-sm text-primary">404</p>
        <h1 className="mt-2 font-display text-display-lg text-ink">
          This page wandered off.
        </h1>
        <p className="mt-3 text-body-sm text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
          Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center font-sans font-medium transition-all duration-150 bg-primary hover:bg-primary-active text-canvas h-10 px-5 text-button rounded-pill"
          >
            Go to dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center font-sans font-medium transition-all duration-150 bg-canvas-soft hover:bg-hairline text-ink h-10 px-5 text-button rounded-pill"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
