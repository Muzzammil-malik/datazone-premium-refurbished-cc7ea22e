import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Package, Tags, Award, Boxes, MessagesSquare, Wrench, Star,
  BarChart3, LayoutTemplate, Image as ImageIcon, Settings as SettingsIcon,
  Search, Bell, Sun, Moon, User, Menu, ChevronsLeft, ChevronsRight, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";

const nav: { to: string; label: string; icon: any; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/brands", label: "Brands", icon: Award },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
  { to: "/admin/inquiries", label: "Customer Inquiries", icon: MessagesSquare },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/homepage", label: "Homepage Manager", icon: LayoutTemplate },
  { to: "/admin/banners", label: "Banner Manager", icon: ImageIcon },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
] as const;

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem("dz.theme");
    const isDark = saved ? saved === "dark" : document.documentElement.classList.contains("dark");
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  return {
    dark,
    toggle: () => {
      const next = !dark;
      setDark(next);
      document.documentElement.classList.toggle("dark", next);
      try { localStorage.setItem("dz.theme", next ? "dark" : "light"); } catch {}
    },
  };
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const { logout } = useAuth();

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-dvh bg-muted/30">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-card transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          "hidden md:flex",
        )}
      >
        <BrandBlock collapsed={collapsed} />
        <NavList collapsed={collapsed} pathname={pathname} />
        <div className="mt-auto p-2 border-t">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="w-full flex items-center gap-2 rounded-md px-2 py-2 text-xs text-muted-foreground hover:bg-accent"
          >
            {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-card flex flex-col border-r">
            <BrandBlock collapsed={false} />
            <NavList collapsed={false} pathname={pathname} />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className={cn("flex flex-col min-h-dvh transition-all", collapsed ? "md:pl-16" : "md:pl-64")}>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 backdrop-blur px-3 md:px-6">
          <button
            className="md:hidden inline-flex items-center justify-center size-9 rounded-md border"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-4" />
          </button>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search products, inquiries…  ⌘K" className="pl-8 h-9" />
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggle}>
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Button variant="ghost" size="icon" aria-label="Logout" onClick={handleLogout}>
              <LogOut className="size-4" />
            </Button>
            <div className="ml-1 inline-flex items-center gap-2 rounded-full border pl-1 pr-3 py-1">
              <span className="grid place-items-center size-7 rounded-full bg-primary text-primary-foreground text-xs font-semibold">DZ</span>
              <span className="hidden sm:inline text-xs font-medium">Admin</span>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6 lg:p-8 max-w-[1400px] w-full">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}

function BrandBlock({ collapsed }: { collapsed: boolean }) {
  return (
    <Link to="/admin" className="h-14 flex items-center gap-2 px-4 border-b">
      <span className="grid place-items-center size-8 rounded-md bg-foreground text-background font-black">D</span>
      {!collapsed && (
        <div className="leading-tight">
          <div className="text-sm font-semibold">DATAZONe</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Admin</div>
        </div>
      )}
    </Link>
  );
}

function NavList({ collapsed, pathname }: { collapsed: boolean; pathname: string }) {
  return (
    <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
      {nav.map((item) => {
        const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "group flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors",
              active ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              collapsed && "justify-center",
            )}
            title={collapsed ? item.label : undefined}
          >
            <Icon className={cn("size-4 shrink-0", active && "text-primary")} />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

// Reusable helpers
export function PageHeader({
  title, description, actions,
}: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 mb-6">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight truncate">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label, value, delta, icon: Icon, tone = "default",
}: { label: string; value: string | number; delta?: string; icon: any; tone?: "default" | "positive" | "warning" | "danger" }) {
  const toneClass = {
    default: "text-foreground",
    positive: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    danger: "text-red-600 dark:text-red-400",
  }[tone];
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
        <Icon className={cn("size-4", toneClass)} />
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      {delta && <div className={cn("mt-1 text-xs", toneClass)}>{delta}</div>}
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed p-10 text-center">
      <div className="text-sm font-medium">{title}</div>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      {action && <div className="mt-4 inline-flex">{action}</div>}
    </div>
  );
}