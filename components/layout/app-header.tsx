"use client";

import { LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AppHeaderProps = {
  onMenuToggle: () => void;
  menuOpen: boolean;
};

export function AppHeader({ onMenuToggle, menuOpen }: AppHeaderProps) {
  const router = useRouter();
  const supabase = createClient();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleLogout() {
    setLoggingOut(true);

    const { error } = await supabase.auth.signOut({
      scope: "local",
    });

    if (error) {
      console.error("Could not sign out:", error.message);
      setLoggingOut(false);
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-card/60 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="app-sidebar"
            onClick={onMenuToggle}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <div className="font-serif text-lg md:text-xl">
            Deuterocanonical-Canonical Bible
          </div>
        </div>

        {mounted ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              type="button"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              type="button"
              aria-label="Log out"
              disabled={loggingOut}
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {loggingOut ? "Logging out..." : "Log out"}
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  );
}