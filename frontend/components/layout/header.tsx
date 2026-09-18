"use client";

import {
  Bell,
  Search,
  Menu,
  LayoutDashboard,
  CalendarDays,
  Wrench,
  Users,
  BarChart3,
  Settings,
  Car,
} from "lucide-react";

import { usePathname, useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "./theme-toggle";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import * as React from "react";

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

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] =
    React.useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" || pathname === "/dashboard";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setMobileMenuOpen(false);
  };

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b bg-background px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        {/* Mobile Menu */}
        <Sheet
          open={mobileMenuOpen}
          onOpenChange={setMobileMenuOpen}
        >
          <SheetTrigger
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-[280px] p-0"
          >
            {/* Mobile Logo */}
            <SheetHeader className="border-b px-5 py-5">
              <SheetTitle className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Car className="h-4 w-4" />
                </div>

                <div className="text-left">
                  <p className="text-sm font-semibold">
                    Instant Mechanic
                  </p>

                  <p className="text-xs font-normal text-muted-foreground">
                    Operations
                  </p>
                </div>
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-col p-3">
              <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Main Menu
              </p>

              <nav className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() =>
                        handleNavigation(item.href)
                      }
                      aria-current={
                        active ? "page" : undefined
                      }
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px]" />

                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <Separator className="my-4" />

              <button
                type="button"
                onClick={() =>
                  handleNavigation("/settings")
                }
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                  isActive("/settings")
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Settings className="h-[18px] w-[18px]" />

                <span>Settings</span>
              </button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search bookings, customers..."
            className="w-[280px] pl-9 lg:w-[340px]"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Mobile Search */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Theme */}
        <ThemeToggle />

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
        </Button>

        <Separator
          orientation="vertical"
          className="mx-2 h-8"
        />

        {/* User */}
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback>KS</AvatarFallback>
          </Avatar>

          <div className="hidden text-right md:block">
            <p className="text-sm font-medium">
              Kunal Sahu
            </p>

            <p className="text-xs text-muted-foreground">
              Operations Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}