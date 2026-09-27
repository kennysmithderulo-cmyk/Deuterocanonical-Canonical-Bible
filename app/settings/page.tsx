"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

type Profile = {
  id: string;
  email: string;
  display_name: string | null;
  preferred_translation: string | null;
  preferred_canon: "protestant" | "roman_catholic" | "eastern_orthodox" | "oriental_orthodox" | "ethiopian_eritrean_orthodox" | "syriac" | "custom" | null;
  theme: "light" | "dark" | "system" | null;
  font_size: "sm" | "md" | "lg" | "xl" | null;
};

export default function SettingsPage() {
  const supabase = createClient();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Please sign in to manage settings.");
        return;
      }
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (error) {
        setError("Unable to load profile. Ensure migrations are applied.");
        return;
      }
      setProfile(data);
    })();
  }, []);

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    setError(null);
    const { error } = await supabase.from("profiles").update(profile).eq("id", profile.id);
    if (error) setError("Unable to save settings.");
    setSaving(false);
  };

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        {error && <p className="text-destructive">{error}</p>}
        {!error && <p className="text-muted-foreground">Loading...</p>}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your study preferences.</p>
      </div>

      <div className="rounded-lg border bg-card p-4 space-y-3">
        <h2 className="font-semibold">Profile</h2>
        <div>
          <label className="block text-sm mb-1">Display name</label>
          <input
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={profile.display_name || ""}
            onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={profile.email}
            disabled
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4 space-y-3">
        <h2 className="font-semibold">Study Preferences</h2>
        <div>
          <label className="block text-sm mb-1">Preferred canon</label>
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={profile.preferred_canon || "protestant"}
            onChange={(e) =>
              setProfile({
                ...profile,
                preferred_canon: e.target.value as Profile["preferred_canon"],
              })
            }
          >
            <option value="protestant">Protestant</option>
            <option value="roman_catholic">Roman Catholic</option>
            <option value="eastern_orthodox">Eastern Orthodox</option>
            <option value="oriental_orthodox">Oriental Orthodox</option>
            <option value="ethiopian_eritrean_orthodox">Ethiopian/Eritrean Orthodox</option>
            <option value="syriac">Syriac</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Preferred translation (code)</label>
          <input
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={profile.preferred_translation || ""}
            onChange={(e) => setProfile({ ...profile, preferred_translation: e.target.value })}
            placeholder="e.g., WEB"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Font size</label>
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={profile.font_size || "md"}
            onChange={(e) => setProfile({ ...profile, font_size: e.target.value as Profile["font_size"] })}
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
            <option value="xl">Extra Large</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Theme</label>
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={theme || "system"}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
        <Button onClick={saveProfile} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h2 className="font-semibold mb-2">About</h2>
        <p className="text-sm text-muted-foreground">
          Deuterocanonical-Canonical Bible is a professional study platform. Bible text must be imported from public-domain or properly licensed sources. See supabase/seed/README_import_guide.md.
        </p>
      </div>
    </div>
  );
}