"use client";
import { useState, useEffect, useCallback } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LikeButtonProps {
  slug: string;
  initialLikes: number;
}

export default function LikeButton({ slug, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const key = `liked:${slug}`;
    try {
      setLiked(localStorage.getItem(key) === "1");
    } catch {}
  }, [slug]);

  const handleLike = useCallback(async () => {
    if (pending) return;
    const key = `liked:${slug}`;
    let already = false;
    try {
      already = localStorage.getItem(key) === "1";
    } catch {}
    if (already) return; // already liked
    setPending(true);
    setLiked(true);
    setLikes((l) => l + 1); // optimistic
    try {
      const res = await fetch(`/api/blogs/${slug}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.likes === "number") {
          setLikes(data.likes);
        }
        try {
          localStorage.setItem(key, "1");
        } catch {}
      } else {
        throw new Error("Like failed");
      }
    } catch (e) {
      // rollback
      setLiked(false);
      setLikes((l) => Math.max(0, l - 1));
      console.error(e);
    } finally {
      setPending(false);
    }
  }, [slug, pending]);

  return (
    <Button
      variant={liked ? "default" : "outline"}
      onClick={handleLike}
      disabled={pending}
      aria-pressed={liked}
      aria-label={liked ? "You liked this article" : "Like this article"}
      className={`shadow-lg flex items-center gap-2 relative group ${
        liked ? "bg-pink-600 hover:bg-pink-600 text-white" : ""
      }`}
    >
      <Heart
        className={`h-4 w-4 transition-transform duration-300 ${
          liked ? "fill-current scale-110" : "group-hover:scale-110"
        }`}
      />
      <span className="tabular-nums">{likes.toLocaleString()}</span>
      <span className="sr-only">likes</span>
    </Button>
  );
}
