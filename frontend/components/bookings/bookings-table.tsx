"use client";

import {
  CarFront,
  MoreHorizontal,
  Phone,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Booking } from "@/lib/operations-types";

import { BookingStatusBadge } from "./booking-status-badge";

interface BookingsTableProps {
  data: Booking[];

  onBookingClick?: (
    booking: Booking
  ) => void;

  onEditBooking?: (
    booking: Booking
  ) => void;

  onCancelBooking?: (
    booking: Booking
  ) => void;
}

/**
 * Return the human-readable booking ID.
 *
 * booking.id remains the MongoDB ID used
 * internally for API operations.
 */
function getDisplayBookingId(
  booking: Booking
): string {
  return (
    booking.bookingId ??
    booking.id
  );
}

/**
 * Format backend ISO dates into a
 * human-readable date for the dashboard.
 *
 * Examples:
 * 2026-09-16T00:00:00.000Z
 * → 16 Sep 2026
 *
 * YYYY-MM-DD values are handled directly
 * to avoid timezone-related date shifts.
 */
function formatBookingDate(
  date: string
): string {
  if (!date) {
    return "—";
  }

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(
      date
    )
  ) {
    const [
      year,
      month,
      day,
    ] = date.split("-");

    const parsedDate =
      new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return date;
  }

  return parsedDate.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

export function BookingsTable({
  data,
  onBookingClick,
  onEditBooking,
  onCancelBooking,
}: BookingsTableProps) {
  if (!data.length) {
    return null;
  }

  return (
    <>
      {/* Desktop / Tablet */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30 text-left">
              <th className="px-5 py-3 font-medium text-muted-foreground">
                Booking
              </th>

              <th className="px-5 py-3 font-medium text-muted-foreground">
                Customer
              </th>

              <th className="px-5 py-3 font-medium text-muted-foreground">
                Vehicle
              </th>

              <th className="px-5 py-3 font-medium text-muted-foreground">
                Service
              </th>

              <th className="px-5 py-3 font-medium text-muted-foreground">
                Date & Time
              </th>

              <th className="px-5 py-3 font-medium text-muted-foreground">
                Amount
              </th>

              <th className="px-5 py-3 font-medium text-muted-foreground">
                Status
              </th>

              <th className="w-12 px-3 py-3" />
            </tr>
          </thead>

          <tbody className="divide-y">
            {data.map(
              (booking) => {
                const displayId =
                  getDisplayBookingId(
                    booking
                  );

                const formattedDate =
                  formatBookingDate(
                    booking.date
                  );

                return (
                  <tr
                    key={booking.id}
                    className="group transition-colors hover:bg-muted/20"
                  >
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          onBookingClick?.(
                            booking
                          )
                        }
                        className="font-semibold hover:text-primary hover:underline"
                      >
                        {displayId}
                      </button>
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium">
                          {
                            booking.customer
                          }
                        </p>

                        <a
                          href={`tel:${booking.phone.replace(
                            /\s/g,
                            ""
                          )}`}
                          className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                        >
                          <Phone className="h-3 w-3" />

                          {
                            booking.phone
                          }
                        </a>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                          <CarFront className="h-4 w-4 text-muted-foreground" />
                        </div>

                        <span>
                          {
                            booking.vehicle
                          }
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium">
                          {
                            booking.service
                          }
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {
                            booking.mechanic
                          }
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p>
                          {
                            formattedDate
                          }
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {
                            booking.time
                          }
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-semibold">
                      ₹
                      {booking.amount.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <BookingStatusBadge
                        status={
                          booking.status
                        }
                      />
                    </td>

                    <td className="px-3 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted"
                          aria-label={`Actions for ${displayId}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              onBookingClick?.(
                                booking
                              )
                            }
                          >
                            View details
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              onEditBooking?.(
                                booking
                              )
                            }
                          >
                            Edit booking
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-destructive"
                            disabled={
                              booking.status ===
                                "Cancelled" ||
                              booking.status ===
                                "Completed"
                            }
                            onClick={() =>
                              onCancelBooking?.(
                                booking
                              )
                            }
                          >
                            Cancel booking
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="divide-y md:hidden">
        {data.map(
          (booking) => {
            const displayId =
              getDisplayBookingId(
                booking
              );

            const formattedDate =
              formatBookingDate(
                booking.date
              );

            return (
              <div
                key={booking.id}
                className="space-y-4 p-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      onBookingClick?.(
                        booking
                      )
                    }
                    className="text-left"
                  >
                    <p className="font-semibold hover:text-primary">
                      {
                        displayId
                      }
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {
                        booking.customer
                      }
                    </p>
                  </button>

                  <BookingStatusBadge
                    status={
                      booking.status
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Vehicle
                    </p>

                    <p className="mt-1 font-medium">
                      {
                        booking.vehicle
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Service
                    </p>

                    <p className="mt-1 font-medium">
                      {
                        booking.service
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Date
                    </p>

                    <p className="mt-1 font-medium">
                      {
                        formattedDate
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Amount
                    </p>

                    <p className="mt-1 font-semibold">
                      ₹
                      {booking.amount.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-3">
                  <p className="text-xs text-muted-foreground">
                    {booking.time} ·{" "}
                    {
                      booking.mechanic
                    }
                  </p>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
                      aria-label={`Actions for ${displayId}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          onBookingClick?.(
                            booking
                          )
                        }
                      >
                        View details
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() =>
                          onEditBooking?.(
                            booking
                          )
                        }
                      >
                        Edit booking
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() =>
                          onCancelBooking?.(
                            booking
                          )
                        }
                        disabled={
                          booking.status ===
                            "Cancelled" ||
                          booking.status ===
                            "Completed"
                        }
                      >
                        Cancel booking
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          }
        )}
      </div>
    </>
  );
}