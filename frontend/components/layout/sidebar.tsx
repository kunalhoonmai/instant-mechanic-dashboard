"use client";

import {
  BarChart3,
  CalendarDays,
  Car,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Settings,
  Users,
  Wrench,
} from "lucide-react";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const navigation = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    label: "Bookings",
    icon: CalendarDays,
    href: "/bookings",
  },
  {
    label: "Mechanics",
    icon: Wrench,
    href: "/mechanics",
  },
  {
    label: "Customers",
    icon: Users,
    href: "/customers",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics",
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" || pathname === "/dashboard";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <aside
      className={`relative hidden h-full shrink-0 border-r bg-background transition-all duration-300 lg:flex ${
        collapsed ? "w-19" : "w-62.5"
      }`}
    >
      <div className="flex w-full flex-col">
        {/* Logo */}
        <div
          className={`flex h-20 items-center border-b px-5 ${
            collapsed ? "justify-center px-2" : "gap-3"
          }`}
        >
          <button
            type="button"
            onClick={() => handleNavigation("/")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90"
            aria-label="Go to Overview"
          >
            <Car className="h-5 w-5" />
          </button>

          {!collapsed && (
            <button
              type="button"
              onClick={() => handleNavigation("/")}
              className="text-left"
            >
              <h1 className="text-base font-semibold tracking-tight">
                Instant Mechanic
              </h1>

              <p className="text-xs text-muted-foreground">
                Operations
              </p>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {!collapsed && (
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Main Menu
            </p>
          )}

          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavigation(item.href)}
                title={collapsed ? item.label : undefined}
                aria-current={active ? "page" : undefined}
                className={`group flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                } ${collapsed ? "justify-center" : "gap-3"}`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />

                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t p-3">
          <button
            type="button"
            onClick={() => handleNavigation("/settings")}
            className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive("/settings")
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            } ${collapsed ? "justify-center" : "gap-3"}`}
            title={collapsed ? "Settings" : undefined}
          >
            <Settings className="h-4.5 w-4.5" />

            {!collapsed && <span>Settings</span>}
          </button>

          {/* Collapse */}
          <button
            type="button"
            onClick={() => setCollapsed((current) => !current)}
            className="mt-2 flex w-full items-center justify-center rounded-lg border py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}