"use client";

import * as React from "react";

import {
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  User,
  Wrench,
  XCircle,
  Pencil,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import type {
  Booking,
  BookingStatus,
} from "@/lib/operations-types";

interface BookingDetailsProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (booking: Booking) => void;
  onCancel?: (booking: Booking) => void;
}

const statusConfig: Record<
  BookingStatus,
  {
    icon: React.ElementType;
    className: string;
  }
> = {
  Completed: {
    icon: CheckCircle2,
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },

  Pending: {
    icon: Clock3,
    className:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },

  Assigned: {
    icon: Wrench,
    className:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },

  Cancelled: {
    icon: XCircle,
    className:
      "bg-red-500/10 text-red-600 dark:text-red-400",
  },
};

export function BookingDetails({
  booking,
  open,
  onOpenChange,
  onEdit,
  onCancel,
}: BookingDetailsProps) {
  if (!booking) {
    return null;
  }

  const status =
    statusConfig[booking.status];

  const StatusIcon =
    status.icon;

  /*
   * Human-readable booking ID.
   *
   * booking.id is the MongoDB document ID
   * and should remain internal for API operations.
   *
   * booking.bookingId is the user-facing ID,
   * such as BK-10853.
   */
  const displayBookingId =
    booking.bookingId ??
    booking.id;

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent
        side="right"
        className="w-full overflow-y-auto p-0 sm:max-w-xl"
      >
        <SheetHeader className="border-b px-6 py-6">
          <div className="flex items-start justify-between gap-4 pr-8">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <SheetTitle className="text-xl">
                  Booking Details
                </SheetTitle>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                >
                  <StatusIcon className="h-3.5 w-3.5" />

                  {booking.status}
                </span>
              </div>

              <SheetDescription className="mt-1">
                {displayBookingId}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6 p-6">
          {/* Summary */}
          <div className="rounded-2xl border bg-linear-to-br from-muted/60 to-muted/20 p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Booking ID
                </p>

                <p className="mt-1 font-semibold">
                  {displayBookingId}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Service Amount
                </p>

                <p className="mt-1 text-2xl font-bold">
                  ₹
                  {booking.amount.toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Customer */}
          <section>
            <SectionTitle
              icon={User}
              title="Customer Information"
            />

            <div className="mt-3 overflow-hidden rounded-xl border">
              <InfoRow
                label="Customer"
                value={booking.customer}
              />

              <InfoRow
                label="Phone"
                value={booking.phone}
                action={
                  <a
                    href={`tel:${booking.phone.replace(
                      /\s/g,
                      ""
                    )}`}
                    className="rounded-md p-1.5 text-primary hover:bg-primary/10"
                  >
                    <Phone className="h-4 w-4" />
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

            <div className="mt-3 overflow-hidden rounded-xl border">
              <InfoRow
                label="Vehicle"
                value={booking.vehicle}
              />

              <InfoRow
                label="Service"
                value={booking.service}
              />
            </div>
          </section>

          {/* Appointment */}
          <section>
            <SectionTitle
              icon={CalendarDays}
              title="Appointment"
            />

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <InfoCard
                icon={CalendarDays}
                label="Date"
                value={booking.date}
              />

              <InfoCard
                icon={Clock3}
                label="Time"
                value={booking.time}
              />

              <InfoCard
                icon={Wrench}
                label="Mechanic"
                value={booking.mechanic}
              />

              <InfoCard
                icon={MapPin}
                label="Service Location"
                value="Customer Location"
              />
            </div>
          </section>

          {/* Timeline */}
          <section>
            <SectionTitle
              icon={Clock3}
              title="Booking Timeline"
            />

            <div className="mt-4 space-y-5">
              <TimelineItem
                title="Booking Created"
                description={`${booking.date} at ${booking.time}`}
                active
              />

              <TimelineItem
                title="Mechanic Assigned"
                description={
                  booking.status === "Pending"
                    ? "Waiting for mechanic assignment"
                    : `${booking.mechanic} assigned`
                }
                active={
                  booking.status !==
                  "Pending"
                }
              />

              <TimelineItem
                title="Service Completed"
                description={
                  booking.status ===
                  "Completed"
                    ? "Service successfully completed"
                    : booking.status ===
                      "Cancelled"
                    ? "Booking was cancelled"
                    : "Service not completed yet"
                }
                active={
                  booking.status ===
                  "Completed"
                }
                last
              />
            </div>
          </section>

          {/* Actions */}
          <div className="border-t pt-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="flex-1"
                onClick={() =>
                  onEdit?.(booking)
                }
              >
                <Pencil className="h-4 w-4" />

                Edit Booking
              </Button>

              <a
                href={`tel:${booking.phone.replace(
                  /\s/g,
                  ""
                )}`}
                className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Phone className="h-4 w-4" />

                Call Customer
              </a>
            </div>

            {booking.status !==
              "Cancelled" &&
              booking.status !==
                "Completed" && (
                <Button
                  variant="ghost"
                  className="mt-2 w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() =>
                    onCancel?.(booking)
                  }
                >
                  <XCircle className="h-4 w-4" />

                  Cancel Booking
                </Button>
              )}
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
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <div className="flex items-center gap-2 text-right text-sm font-medium">
        {value}

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
    <div className="rounded-xl border p-4 transition-colors hover:bg-muted/30">
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

function TimelineItem({
  title,
  description,
  active,
  last = false,
}: {
  title: string;
  description: string;
  active: boolean;
  last?: boolean;
}) {
  return (
    <div className="relative flex gap-3">
      {!last && (
        <div
          className={`absolute left-2.25 top-5 h-full w-px ${
            active
              ? "bg-primary/40"
              : "bg-border"
          }`}
        />
      )}

      <div
        className={`relative z-10 mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 ${
          active
            ? "border-primary bg-primary"
            : "border-muted-foreground/30 bg-background"
        }`}
      />

      <div className="pb-1">
        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}