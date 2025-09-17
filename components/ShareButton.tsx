"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

type Props = React.ComponentProps<typeof Button> & {
  url?: string;
};

export default function ShareButton({ url, children, ...rest }: Props) {
  const [copied, setCopied] = useState(false);
  async function handleClick() {
    try {
      const href =
        url || (typeof window !== "undefined" ? window.location.href : "");
      if (href) await navigator.clipboard.writeText(href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }
  return (
    <Button onClick={handleClick} {...rest}>
      <Share2 className="h-4 w-4" />
      <span>{copied ? "Copied" : children ?? "Share"}</span>
    </Button>
  );
}
