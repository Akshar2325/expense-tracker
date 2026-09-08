"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-display-md text-ink">Welcome back.</h1>
        <p className="mt-2 text-body-sm text-muted">
          Sign in to continue to your ledger.
        </p>
      </div>

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
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />

        {error && (
          <p className="text-sm text-semantic-error bg-semantic-error/5 border border-semantic-error/20 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" loading={loading} className="w-full mt-2">
          Sign In
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-between text-body-sm">
        <Link
          href="/forgot-password"
          className="text-muted hover:text-ink transition-colors"
        >
          Forgot password?
        </Link>
        <Link
          href="/register"
          className="text-ink font-medium hover:text-primary transition-colors"
        >
          Create account
        </Link>
      </div>
    </Card>
  );
}
