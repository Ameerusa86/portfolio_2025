"use client";

import React, { useState, useEffect } from "react";
import AboutForm from "@/components/admin/AboutForm";
import { AboutData, CreateAboutData, UpdateAboutData } from "@/types/about";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export default function AdminAboutPage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/about");
      if (!response.ok) {
        throw new Error(`Failed to fetch about data: ${response.statusText}`);
      }

      const data = await response.json();
      setAboutData(data);
    } catch (err) {
      console.error("Failed to load about data:", err);
      setError("Failed to load about data. Please try again.");
      toast.error("Failed to load about data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: CreateAboutData | UpdateAboutData) => {
    try {
      setSaving(true);

      let response;
      if ("id" in data && data.id) {
        // Update existing
        response = await fetch("/api/about", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } else {
        // Create new
        response = await fetch("/api/about", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save about data");
      }

      const savedData = await response.json();
      setAboutData(savedData);
      toast.success("About page updated successfully!");

      // Reload data to ensure consistency
      await loadAboutData();
    } catch (err) {
      console.error("Failed to save about data:", err);
      toast.error("Failed to save about data. Please try again.");
      throw err; // Re-throw to let the form handle it
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <AboutFormSkeleton />;
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="flex flex-col items-center text-center p-8">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button
              onClick={loadAboutData}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <AboutForm aboutData={aboutData} onSave={handleSave} isLoading={saving} />
    </div>
  );
}

function AboutFormSkeleton() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Hero Section */}
      <Card>
        <div className="p-6 space-y-6">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </Card>

      {/* Story Section */}
      <Card>
        <div className="p-6 space-y-6">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </Card>

      {/* Skills Section */}
      <Card>
        <div className="p-6 space-y-6">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-20" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-18" />
            </div>
          </div>
        </div>
      </Card>

      {/* CTA Section */}
      <Card>
        <div className="p-6 space-y-6">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
