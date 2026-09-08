"use client";

import { useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setError(null);
    try {
      await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: { email },
      });
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-display-md text-ink">
          Reset password.
        </h1>
        <p className="mt-2 text-body-sm text-muted">
          Enter your email and we&apos;ll send a reset link.
        </p>
      </div>

      {status === "sent" ? (
        <div className="flex flex-col gap-4">
          <div className="rounded-md bg-semantic-success/5 border border-semantic-success/20 px-4 py-3 text-sm text-semantic-success">
            If an account exists for <strong>{email}</strong>, a reset link is
            on its way. Check your inbox.
          </div>
          <Link href="/login" className="btn-outline w-full">
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          {error && (
            <p className="text-sm text-semantic-error bg-semantic-error/5 border border-semantic-error/20 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" loading={loading} className="w-full mt-2">
            Send Reset Link
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-body-sm text-muted">
        Remembered it?{" "}
        <Link
          href="/login"
          className="text-ink font-medium hover:text-primary transition-colors"
        >
          Sign in
        </Link>
      </p>
    </Card>
  );
}
