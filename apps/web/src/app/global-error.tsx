"use client";

import { useEffect } from "react";
import Link from "next/link";
import { GradientOrb } from "@/components/ui/orb";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to the console in development
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas text-body font-sans">
        <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
          <GradientOrb
            color="peach"
            className="top-0 -right-40 w-96 h-96 opacity-30"
          />
          <GradientOrb
            color="sky"
            className="bottom-0 -left-40 w-80 h-80 opacity-30"
            delay="8s"
          />

          <div className="relative w-full max-w-md text-center">
            <p className="font-display text-display-sm text-primary">
              Something went wrong
            </p>
            <h1 className="mt-2 font-display text-display-lg text-ink">
              This page hit a snag.
            </h1>
            <p className="mt-3 text-body-sm text-muted">
              An unexpected error occurred. Your data is safe — try again, or
              head back to the dashboard.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center font-sans font-medium transition-all duration-150 bg-primary hover:bg-primary-active text-canvas h-10 px-5 text-button rounded-pill"
              >
                Try again
              </button>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center font-sans font-medium transition-all duration-150 bg-canvas-soft hover:bg-hairline text-ink h-10 px-5 text-button rounded-pill"
              >
                Go to dashboard
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
