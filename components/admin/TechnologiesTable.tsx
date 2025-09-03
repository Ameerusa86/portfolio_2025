"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function TechnologiesTable() {
  const [items, setItems] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/technologies");
      const json = await res.json();
      setItems(json.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load technologies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      const res = await fetch("/api/technologies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      if (!res.ok) throw new Error("Create failed");
      setName("");
      fetchItems();
      toast.success("Added technology");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add technology");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this technology?")) return;
    try {
      const res = await fetch(`/api/technologies?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      fetchItems();
      toast.success("Deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Technologies</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Add technology"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button onClick={handleCreate} disabled={!name.trim()}>
            Add
          </Button>
        </div>

        <div className="space-y-2">
          {loading && <div className="text-sm text-gray-500">Loading…</div>}
          {!loading && items.length === 0 && (
            <div className="text-sm text-gray-500">No technologies</div>
          )}
          {items.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50"
            >
              <div className="text-sm font-medium">{t.name}</div>
              <div>
                <Button variant="ghost" onClick={() => handleDelete(t.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
