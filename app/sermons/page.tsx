"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type Sermon = { id: string; title: string; main_scripture: string | null; theme: string | null; created_at: string };

export default function SermonsPage() {
  const supabase = createClient();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Please sign in to view sermons.");
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("sermons")
        .select("id,title,main_scripture,theme,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) setError("Unable to load sermons.");
      else setSermons(data || []);
      setLoading(false);
    })();
  }, []);

  const createSermon = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert("Please sign in.");
    const title = prompt("Sermon title:");
    if (!title) return;
    const { error } = await supabase.from("sermons").insert({ user_id: user.id, title, is_private: true });
    if (error) alert("Failed to create sermon.");
    else window.location.reload();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Sermons</h1>
        <Button onClick={createSermon}>
          <Plus className="h-4 w-4 mr-2" /> {"New Sermon"}
        </Button>
      </div>
      {error && <p className="text-destructive">{error}</p>}
      {loading && <p className="text-muted-foreground">Loading...</p>}
      {!loading && sermons.length === 0 && (
        <p className="text-muted-foreground">
          No sermons yet. Click &quot;New Sermon&quot; to create one.
        </p>
      )}
      {!loading && sermons.length > 0 && (
        <div className="space-y-3">
          {sermons.map((s) => (
            <div key={s.id} className="rounded-md border bg-card p-3">
              <div className="font-semibold text-sm">{s.title}</div>
              {s.main_scripture && <p className="text-sm text-muted-foreground mt-1">{s.main_scripture}</p>}
              {s.theme && <p className="text-sm text-muted-foreground mt-1">Theme: {s.theme}</p>}
              <div className="text-xs text-muted-foreground mt-1">{new Date(s.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
      <p className="mt-6 text-xs text-muted-foreground">
        Sermon builder (outlines, sections, export) will be implemented in Phase 7.
      </p>
    </div>
  );
}