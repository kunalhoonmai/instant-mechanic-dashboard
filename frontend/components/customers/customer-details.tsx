"use client";

import * as React from "react";

import {
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  User,
  Wallet,
  XCircle,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import type { Customer } from "./customers-page";

interface CustomerDetailsProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (customer: Customer) => void;
}

const statusConfig = {
  Active: {
    icon: CheckCircle2,
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },

  Inactive: {
    icon: XCircle,
    className:
      "bg-red-500/10 text-red-600 dark:text-red-400",
  },
};

export function CustomerDetails({
  customer,
  open,
  onOpenChange,
  onEdit,
}: CustomerDetailsProps) {
  if (!customer) {
    return null;
  }

  const status =
    statusConfig[
      customer.status
    ];

  const StatusIcon =
    status.icon;

  return (
    <Sheet
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <SheetContent
        side="right"
        className="w-full overflow-y-auto p-0 sm:max-w-xl"
      >
        {/* Header */}

        <SheetHeader className="border-b px-6 py-6">
          <div className="flex items-start gap-4 pr-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <SheetTitle className="text-xl">
                  {customer.name}
                </SheetTitle>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                >
                  <StatusIcon className="h-3.5 w-3.5" />

                  {customer.status}
                </span>
              </div>

              <SheetDescription className="mt-1">
                {customer.customerId ??
                  "Customer ID unavailable"}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6 p-6">
          {/* Customer Summary */}

          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Total Bookings
                </p>

                <p className="mt-1 text-xl font-bold">
                  {customer.totalBookings}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Total Spent
                </p>

                <p className="mt-1 text-xl font-bold">
                  ₹
                  {customer.totalSpent.toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}

          <section>
            <SectionTitle
              icon={User}
              title="Contact Information"
            />

            <div className="mt-3 rounded-xl border">
              <InfoRow
                label="Customer"
                value={
                  customer.name
                }
              />

              <InfoRow
                label="Phone"
                value={
                  customer.phone
                }
                action={
                  <a
                    href={`tel:${customer.phone.replace(
                      /\s/g,
                      ""
                    )}`}
                    className="text-primary hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                }
              />

              <InfoRow
                label="Email"
                value={
                  customer.email
                }
                action={
                  <a
                    href={`mailto:${customer.email}`}
                    className="text-primary hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                }
              />
            </div>
          </section>

          {/* Vehicle */}

          <section>
            <SectionTitle
              icon={Car}
              title="Vehicle Information"
            />

            <div className="mt-3 rounded-xl border">
              <InfoRow
                label="Vehicle"
                value={
                  customer.vehicle
                }
              />
            </div>
          </section>

          {/* Service History */}

          <section>
            <SectionTitle
              icon={CalendarDays}
              title="Service History"
            />

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <InfoCard
                icon={CalendarDays}
                label="Total Bookings"
                value={`${customer.totalBookings} bookings`}
              />

              <InfoCard
                icon={Clock3}
                label="Last Booking"
                value={
                  customer.lastBooking
                }
              />

              <InfoCard
                icon={Wallet}
                label="Total Spent"
                value={`₹${customer.totalSpent.toLocaleString(
                  "en-IN"
                )}`}
              />

              <InfoCard
                icon={Car}
                label="Vehicle"
                value={
                  customer.vehicle
                }
              />
            </div>
          </section>

          {/* Actions */}

          <div className="border-t pt-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="flex-1"
                onClick={() => {
                  onOpenChange(
                    false
                  );

                  onEdit?.(
                    customer
                  );
                }}
              >
                <User className="h-4 w-4" />

                Edit Customer
              </Button>

              <a
                href={`tel:${customer.phone.replace(
                  /\s/g,
                  ""
                )}`}
                className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Phone className="h-4 w-4" />

                Call Customer
              </a>
            </div>

            <Button
              variant="ghost"
              className="mt-2 w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <XCircle className="h-4 w-4" />

              {customer.status ===
              "Active"
                ? "Deactivate Customer"
                : "Delete Customer"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SectionTitle({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>

      <h3 className="text-sm font-semibold">
        {title}
      </h3>
    </div>
  );
}

function InfoRow({
  label,
  value,
  action,
}: {
  label: string;
  value: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b px-4 py-3 last:border-b-0">
      <span className="shrink-0 text-sm text-muted-foreground">
        {label}
      </span>

      <div className="flex min-w-0 items-center gap-2 text-right text-sm font-medium">
        <span className="truncate">
          {value}
        </span>

        {action}
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />

        <span className="text-xs">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-medium">
        {value}
      </p>
    </div>
  );
}