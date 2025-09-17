"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
    // open confirm dialog handled by UI — this function will be called after confirmation
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

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const startEdit = (t: { id: number; name: string }) => {
    setEditingId(t.id);
    setEditingName(t.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const trimmed = editingName.trim();
    if (!trimmed) return toast.error("Name required");
    try {
      const res = await fetch(`/api/technologies`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, name: trimmed }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Updated");
      cancelEdit();
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  return (
    <Card className="border border-border shadow-lg bg-card/70">
      <CardHeader className="border-b border-border bg-card/60">
        <CardTitle className="text-foreground">Technologies</CardTitle>
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
          {loading && (
            <div className="text-sm text-muted-foreground">Loading…</div>
          )}
          {!loading && items.length === 0 && (
            <div className="text-sm text-muted-foreground">No technologies</div>
          )}
          {items.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-2 rounded-md border border-transparent hover:bg-accent/10 hover:border-border transition-colors"
            >
              <div className="flex-1">
                {editingId === t.id ? (
                  <div className="flex gap-2 items-center">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                    />
                    <Button onClick={saveEdit} disabled={!editingName.trim()}>
                      Save
                    </Button>
                    <Button variant="ghost" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="text-sm font-medium text-foreground">
                    {t.name}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => startEdit(t)}>
                  Edit
                </Button>
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setConfirmDeleteId(t.id)}
                  >
                    Delete
                  </Button>
                  <Dialog
                    open={confirmDeleteId === t.id}
                    onOpenChange={(open) => !open && setConfirmDeleteId(null)}
                  >
                    <DialogContent className="bg-card border border-border">
                      <DialogHeader>
                        <DialogTitle className="text-foreground">
                          Delete technology
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                          Are you sure you want to delete "{t.name}"?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="ghost"
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={async () => {
                            await handleDelete(t.id);
                            setConfirmDeleteId(null);
                          }}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
