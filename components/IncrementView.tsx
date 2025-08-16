"use client";
import { useEffect } from "react";

interface Props {
  slug: string;
}

// Increments view count once per (slug, window) per hour using localStorage guard
export default function IncrementView({ slug }: Props) {
  useEffect(() => {
    if (!slug) return;
    try {
      const key = `viewed:${slug}`;
      const last = localStorage.getItem(key);
      const now = Date.now();
      if (last) {
        const lastTs = parseInt(last, 10);
        // Skip if recorded within past hour
        if (now - lastTs < 60 * 60 * 1000) return;
      }
      fetch(`/api/blogs/${slug}/view`, { method: "POST" }).catch(() => {});
      localStorage.setItem(key, String(now));
    } catch {
      // ignore
    }
  }, [slug]);
  return null;
}
