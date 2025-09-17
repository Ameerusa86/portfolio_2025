"use client";

import React from "react";
import TechnologiesTable from "@/components/admin/TechnologiesTable";
import { Button } from "@/components/ui/button";

export default function AdminTechnologiesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground w-full">
      <div className="w-full site-container py-8 space-y-8 max-w-none">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Technologies
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Add, edit, and remove technology tags used across your content.
            </p>
          </div>
        </div>

        {/* Technologies Table */}
        <div className="bg-card/70 border border-border rounded-xl shadow-sm overflow-hidden">
          <TechnologiesTable />
        </div>
      </div>
    </div>
  );
}
