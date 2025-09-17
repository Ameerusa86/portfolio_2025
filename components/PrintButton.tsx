"use client";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

export default function PrintButton(rest: React.ComponentProps<typeof Button>) {
  function handleClick() {
    try {
      window.print();
    } catch {}
  }
  return (
    <Button onClick={handleClick} {...rest}>
      <FileDown className="h-4 w-4" /> Save/Print
    </Button>
  );
}
