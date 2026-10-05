export const dynamic = 'force-dynamic';
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

type Bookmark = { id: string; scope: string; passage_label: string | null; notes: string | null; created_at: string };
type Note = { id: string; scope: string; content: string; created_at: string };
type Sermon = { id: string; title: string; main_scripture: string | null; created_at: string };

export default function LibraryPage() {
  const supabase = createClient();
  const [tab, setTab] = useState<"bookmarks" | "notes" | "sermons">("bookmarks");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
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
        setError("Please sign in to view your library.");
        setLoading(false);
        return;
      }
      if (tab === "bookmarks") {
        const { data, error } = await supabase
          .from("bookmarks")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50);
        if (error) setError("Unable to load bookmarks.");
        else setBookmarks(data || []);
      } else if (tab === "notes") {
        const { data, error } = await supabase
          .from("notes")
          .select("id,scope,content,created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50);
        if (error) setError("Unable to load notes.");
        else setNotes(data || []);
      } else if (tab === "sermons") {
        const { data, error } = await supabase
          .from("sermons")
          .select("id,title,main_scripture,created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50);
        if (error) setError("Unable to load sermons.");
        else setSermons(data || []);
      }
      setLoading(false);
    })();
  }, [tab]);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Library</h1>
      <div className="flex gap-2 mb-4">
        <Button variant={tab === "bookmarks" ? "default" : "outline"} onClick={() => setTab("bookmarks")}>
          Bookmarks
        </Button>
        <Button variant={tab === "notes" ? "default" : "outline"} onClick={() => setTab("notes")}>
          Notes
        </Button>
        <Button variant={tab === "sermons" ? "default" : "outline"} onClick={() => setTab("sermons")}>
          Sermons
        </Button>
      </div>
      {error && <p className="text-destructive mb-3">{error}</p>}
      {loading && <p className="text-muted-foreground">Loading...</p>}
      {!loading && tab === "bookmarks" && bookmarks.length === 0 && (
        <p className="text-muted-foreground">No bookmarks yet.</p>
      )}
      {!loading && tab === "notes" && notes.length === 0 && (
        <p className="text-muted-foreground">No notes yet.</p>
      )}
      {!loading && tab === "sermons" && sermons.length === 0 && (
        <p className="text-muted-foreground">No sermons yet.</p>
      )}

      {!loading && tab === "bookmarks" && (
        <div className="space-y-3">
          {bookmarks.map((b) => (
            <div key={b.id} className="rounded-md border bg-card p-3">
              <div className="font-semibold text-sm">{b.passage_label || b.scope}</div>
              {b.notes && <p className="text-sm text-muted-foreground mt-1">{b.notes}</p>}
              <div className="text-xs text-muted-foreground mt-1">{new Date(b.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}

      {!loading && tab === "notes" && (
        <div className="space-y-3">
          {notes.map((n) => (
            <div key={n.id} className="rounded-md border bg-card p-3">
              <div className="text-xs text-muted-foreground mb-1">{n.scope}</div>
              <div className="text-sm">{n.content}</div>
              <div className="text-xs text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}

      {!loading && tab === "sermons" && (
        <div className="space-y-3">
          {sermons.map((s) => (
            <div key={s.id} className="rounded-md border bg-card p-3">
              <div className="font-semibold text-sm">{s.title}</div>
              {s.main_scripture && <p className="text-sm text-muted-foreground mt-1">{s.main_scripture}</p>}
              <div className="text-xs text-muted-foreground mt-1">{new Date(s.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}