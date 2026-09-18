"use client";

import * as React from "react";

import {
  Award,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  Star,
  User,
  Wrench,
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

import {
  getBookingDateKey,
  getMechanicJobsToday,
  getMechanicStatus,
  getTodayDateKey,
  useOperationsStore,
} from "@/lib/operations-store";

import type {
  Booking,
  Mechanic,
} from "@/lib/operations-types";

/* --------------------------------
 * PROPS
 * -------------------------------- */

interface MechanicDetailsProps {
  mechanic: Mechanic | null;
  open: boolean;
  onOpenChange: (
    open: boolean
  ) => void;
  onEdit?: (
    mechanic: Mechanic
  ) => void;
}

/* --------------------------------
 * STATUS CONFIG
 * -------------------------------- */

const statusConfig = {
  Available: {
    icon: CheckCircle2,
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },

  "On Service": {
    icon: Clock3,
    className:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },

  Offline: {
    icon: XCircle,
    className:
      "bg-muted text-muted-foreground",
  },
};

/* --------------------------------
 * DATE / TIME HELPERS
 * -------------------------------- */

function getBookingTimestamp(
  booking: Booking
): number {
  if (!booking.date) {
    return 0;
  }

  const datePart =
    getBookingDateKey(
      booking.date
    );

  if (!datePart) {
    return 0;
  }

  const timePart =
    booking.time || "00:00";

  const timestamp =
    new Date(
      `${datePart}T${timePart}`
    ).getTime();

  if (
    Number.isNaN(timestamp)
  ) {
    const fallback =
      new Date(
        booking.date
      ).getTime();

    return Number.isNaN(
      fallback
    )
      ? 0
      : fallback;
  }

  return timestamp;
}

/**
 * Formats a booking date for
 * human-readable dashboard display.
 */
function formatBookingDate(
  booking: Booking
): string {
  const timestamp =
    getBookingTimestamp(
      booking
    );

  if (!timestamp) {
    return booking.date || "—";
  }

  return new Date(
    timestamp
  ).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

/* --------------------------------
 * COMPONENT
 * -------------------------------- */

export function MechanicDetails({
  mechanic,
  open,
  onOpenChange,
  onEdit,
}: MechanicDetailsProps) {
  const { bookings } =
    useOperationsStore();

  if (!mechanic) {
    return null;
  }

  const todayKey =
    getTodayDateKey();

  /* --------------------------------
   * DERIVED STATUS
   * -------------------------------- */

  const currentStatus =
    getMechanicStatus(
      mechanic,
      bookings,
      todayKey
    );

  /* --------------------------------
   * MECHANIC BOOKINGS
   * -------------------------------- */

  const mechanicBookings =
    bookings.filter(
      (booking) => {
        if (
          booking.mechanicId
        ) {
          return (
            booking.mechanicId ===
            mechanic.id
          );
        }

        return (
          booking.mechanic ===
          mechanic.name
        );
      }
    );

  /* --------------------------------
   * TODAY'S BOOKINGS
   * -------------------------------- */

  const todayBookings =
    mechanicBookings.filter(
      (booking) =>
        getBookingDateKey(
          booking.date
        ) === todayKey
    );

  /* --------------------------------
   * TODAY'S JOBS
   * -------------------------------- */

  const todayJobs =
    getMechanicJobsToday(
      mechanic,
      bookings,
      todayKey
    );

  /* --------------------------------
   * TODAY'S WORK
   * -------------------------------- */

  const activeToday =
    todayBookings.filter(
      (booking) =>
        booking.status ===
          "Pending" ||
        booking.status ===
          "Assigned"
    );

  const completedToday =
    todayBookings.filter(
      (booking) =>
        booking.status ===
        "Completed"
    );

  const cancelledToday =
    todayBookings.filter(
      (booking) =>
        booking.status ===
        "Cancelled"
    );

  /* --------------------------------
   * ALL-TIME MECHANIC WORK
   * -------------------------------- */

  const completedWork =
    mechanicBookings.filter(
      (booking) =>
        booking.status ===
        "Completed"
    );

  const cancelledWork =
    mechanicBookings.filter(
      (booking) =>
        booking.status ===
        "Cancelled"
    );

  /* --------------------------------
   * REVENUE
   * -------------------------------- */

  const completedRevenue =
    completedWork.reduce(
      (total, booking) =>
        total + booking.amount,
      0
    );

  const revenueToday =
    completedToday.reduce(
      (total, booking) =>
        total + booking.amount,
      0
    );

  /* --------------------------------
   * CURRENT BOOKING
   * -------------------------------- */

  const currentBooking =
    activeToday.length > 0
      ? [...activeToday].sort(
          (a, b) =>
            getBookingTimestamp(
              a
            ) -
            getBookingTimestamp(
              b
            )
        )[0] ?? null
      : null;

  /* --------------------------------
   * LAST BOOKING
   * -------------------------------- */

  const lastBooking =
    [...mechanicBookings]
      .filter(
        (booking) =>
          getBookingTimestamp(
            booking
          ) <= Date.now()
      )
      .sort(
        (a, b) =>
          getBookingTimestamp(
            b
          ) -
          getBookingTimestamp(
            a
          )
      )[0] ?? null;

  /* --------------------------------
   * STATUS UI
   * -------------------------------- */

  const status =
    statusConfig[
      currentStatus
    ];

  const StatusIcon =
    status.icon;

  /* --------------------------------
   * RENDER
   * -------------------------------- */

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
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-7 w-7" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <SheetTitle className="text-xl">
                  {mechanic.name}
                </SheetTitle>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                >
                  <StatusIcon className="h-3.5 w-3.5" />

                  {currentStatus}
                </span>
              </div>

              <SheetDescription className="mt-1">
                {mechanic.mechanicId ??
                  "Mechanic ID unavailable"}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6 p-6">
          {/* Profile Summary */}

          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Experience
                </p>

                <p className="mt-1 font-semibold">
                  {mechanic.experience}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Rating
                </p>

                <div className="mt-1 flex items-center gap-1 font-semibold">
                  <Star className="h-4 w-4 fill-current text-amber-500" />

                  {mechanic.rating}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Today&apos;s Jobs
                </p>

                <p className="mt-1 font-semibold">
                  {todayJobs}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Specialization
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {mechanic.specialization}
                </p>
              </div>
            </div>
          </div>

          {/* Current & Assigned Work */}

          <section>
            <SectionTitle
              icon={Wrench}
              title="Current & Assigned Work"
            />

            <div className="mt-3 rounded-xl border">
              {currentBooking ? (
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">
                        {
                          currentBooking.service
                        }
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {
                          currentBooking.bookingId ??
                          currentBooking.id
                        }{" "}
                        •{" "}
                        {
                          currentBooking.customer
                        }
                      </p>
                    </div>

                    <StatusBadge
                      status={
                        currentBooking.status
                      }
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <InfoCard
                      icon={CalendarDays}
                      label="Date"
                      value={formatBookingDate(
                        currentBooking
                      )}
                    />

                    <InfoCard
                      icon={Clock3}
                      label="Time"
                      value={
                        currentBooking.time
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <p className="text-sm font-medium">
                    No active work today
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    The mechanic has no
                    Pending or Assigned
                    booking for today.
                  </p>

                  {lastBooking && (
                    <div className="mt-4 rounded-lg bg-muted/50 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">
                            Last Booking
                          </p>

                          <p className="mt-1 text-sm font-semibold">
                            {
                              lastBooking.service
                            }
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {
                              lastBooking.customer
                            }{" "}
                            •{" "}
                            {formatBookingDate(
                              lastBooking
                            )}{" "}
                            •{" "}
                            {
                              lastBooking.time
                            }
                          </p>
                        </div>

                        <StatusBadge
                          status={
                            lastBooking.status
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Today's Activity */}

          <section>
            <SectionTitle
              icon={Clock3}
              title="Today's Activity"
            />

            <div className="mt-3 rounded-xl border">
              <ActivityRow
                title="Today's Jobs"
                value={todayJobs}
              />

              <ActivityRow
                title="Active Jobs"
                value={
                  activeToday.length
                }
              />

              <ActivityRow
                title="Completed Jobs"
                value={
                  completedToday.length
                }
              />

              <ActivityRow
                title="Cancelled Jobs"
                value={
                  cancelledToday.length
                }
              />

              <ActivityRow
                title="Current Status"
                value={
                  currentStatus
                }
                last
              />
            </div>
          </section>

          {/* Completed Work */}

          <section>
            <SectionTitle
              icon={CheckCircle2}
              title="Completed Work"
            />

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <InfoCard
                icon={CheckCircle2}
                label="Completed Jobs"
                value={String(
                  completedWork.length
                )}
              />

              <InfoCard
                icon={CalendarDays}
                label="Completed Today"
                value={String(
                  completedToday.length
                )}
              />

              <InfoCard
                icon={Award}
                label="Completed Revenue"
                value={formatCurrency(
                  completedRevenue
                )}
              />

              <InfoCard
                icon={CalendarDays}
                label="Revenue Today"
                value={formatCurrency(
                  revenueToday
                )}
              />
            </div>
          </section>

          {/* Cancelled Work */}

          <section>
            <SectionTitle
              icon={XCircle}
              title="Cancelled Work"
            />

            <div className="mt-3 rounded-xl border">
              <ActivityRow
                title="Total Cancelled"
                value={
                  cancelledWork.length
                }
              />

              <ActivityRow
                title="Cancelled Today"
                value={
                  cancelledToday.length
                }
                last
              />
            </div>
          </section>

          {/* Contact Information */}

          <section>
            <SectionTitle
              icon={User}
              title="Contact Information"
            />

            <div className="mt-3 rounded-xl border">
              <InfoRow
                label="Phone"
                value={
                  mechanic.phone
                }
                action={
                  <a
                    href={`tel:${mechanic.phone.replace(
                      /\s/g,
                      ""
                    )}`}
                    className="text-primary hover:underline"
                    aria-label={`Call ${mechanic.name}`}
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                }
              />

              <InfoRow
                label="Email"
                value={`${mechanic.name
                  .toLowerCase()
                  .replace(
                    /\s+/g,
                    "."
                  )}@instantmechanic.com`}
                action={
                  <a
                    href={`mailto:${mechanic.name
                      .toLowerCase()
                      .replace(
                        /\s+/g,
                        "."
                      )}@instantmechanic.com`}
                    className="text-primary hover:underline"
                    aria-label={`Email ${mechanic.name}`}
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                }
              />
            </div>
          </section>

          {/* Professional Information */}

          <section>
            <SectionTitle
              icon={Wrench}
              title="Professional Information"
            />

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <InfoCard
                icon={Wrench}
                label="Specialization"
                value={
                  mechanic.specialization
                }
              />

              <InfoCard
                icon={Award}
                label="Experience"
                value={
                  mechanic.experience
                }
              />

              <InfoCard
                icon={Star}
                label="Customer Rating"
                value={`${mechanic.rating} / 5.0`}
              />

              <InfoCard
                icon={CalendarDays}
                label="Today's Jobs"
                value={`${todayJobs} jobs`}
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
                    mechanic
                  );
                }}
              >
                <Wrench className="h-4 w-4" />

                Edit Mechanic
              </Button>

              <a
                href={`tel:${mechanic.phone.replace(
                  /\s/g,
                  ""
                )}`}
                className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Phone className="h-4 w-4" />

                Call Mechanic
              </a>
            </div>

            {currentStatus ===
              "Offline" && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Availability can be
                changed from Edit
                Mechanic.
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* --------------------------------
 * SECTION TITLE
 * -------------------------------- */

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

/* --------------------------------
 * INFO ROW
 * -------------------------------- */

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

      <div className="flex min-w-0 items-center gap-2 text-right text-sm font-medium">
        <span className="truncate">
          {value}
        </span>

        {action}
      </div>
    </div>
  );
}

/* --------------------------------
 * INFO CARD
 * -------------------------------- */

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

/* --------------------------------
 * ACTIVITY ROW
 * -------------------------------- */

function ActivityRow({
  title,
  value,
  last = false,
}: {
  title: string;
  value: string | number;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 ${
        !last
          ? "border-b"
          : ""
      }`}
    >
      <span className="text-sm text-muted-foreground">
        {title}
      </span>

      <span className="text-sm font-medium">
        {value}
      </span>
    </div>
  );
}

/* --------------------------------
 * STATUS BADGE
 * -------------------------------- */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const className =
    status === "Completed"
      ? "bg-emerald-500/10 text-emerald-600"
      : status === "Assigned"
        ? "bg-blue-500/10 text-blue-600"
        : status === "Pending"
          ? "bg-amber-500/10 text-amber-600"
          : "bg-muted text-muted-foreground";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {status}
    </span>
  );
}

/* --------------------------------
 * CURRENCY
 * -------------------------------- */

function formatCurrency(
  amount: number
): string {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(amount);
}