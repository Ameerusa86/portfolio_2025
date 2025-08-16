"use client";
import React, { useEffect, useState } from "react";

interface ReadingProgressProps {
  targetSelector?: string;
}

export const ReadingProgress: React.FC<ReadingProgressProps> = ({
  targetSelector = "#article-content",
}) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const target = document.querySelector(targetSelector);
    if (!target) return;
    const handleScroll = () => {
      const total = (target as HTMLElement).scrollHeight - window.innerHeight;
      const scrolled = window.scrollY - (target as HTMLElement).offsetTop;
      const pct = Math.min(100, Math.max(0, (scrolled / total) * 100));
      setProgress(isFinite(pct) ? pct : 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [targetSelector]);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ReadingProgress;
