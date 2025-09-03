"use client";

import React from "react";
import TechnologiesTable from "@/components/admin/TechnologiesTable";

export default function AdminTechnologiesPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Technologies</h1>
      <TechnologiesTable />
    </div>
  );
}
