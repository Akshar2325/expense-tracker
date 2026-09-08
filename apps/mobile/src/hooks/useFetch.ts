import { useCallback, useEffect, useRef, useState } from "react";
import { authedRequest } from "@/lib/api";

interface UseFetchOptions {
  /** Auto-fetch on mount (default true). */
  enabled?: boolean;
}

export function useFetch<T>(path: string, options: UseFetchOptions = {}) {
  const { enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await authedRequest<T>(path);
      if (mounted.current) setData(result);
    } catch (e) {
      if (mounted.current) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    mounted.current = true;
    if (enabled) {
      load();
    }
    return () => {
      mounted.current = false;
    };
  }, [enabled, load]);

  return { data, loading, error, refetch: load };
}
