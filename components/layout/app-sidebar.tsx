"use client";

import {
  BookMarked,
  BookOpen,
  Home,
  PenTool,
  Search,
  Settings,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/bible", label: "Bible", icon: BookOpen },
  { href: "/study", label: "Study", icon: Search },
  { href: "/sermons", label: "Sermons", icon: PenTool },
  { href: "/library", label: "Library", icon: BookMarked },
  { href: "/settings", label: "Settings", icon: Settings },
];

type AppSidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

export function AppSidebar({ mobileOpen, onClose }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        id="app-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col gap-1 border-r bg-card p-4 shadow-xl transition-transform duration-200 md:static md:z-auto md:w-60 md:translate-x-0 md:bg-card/40 md:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-4 flex items-center justify-between md:hidden">
          <span className="font-serif text-base font-semibold">
            Study Bible
          </span>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close navigation menu"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-col gap-1" aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent/20 hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}